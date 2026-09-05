import { defineStore } from 'pinia'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/plugins/firebase'
import { slugify } from '@/utils/constants'

const productsCol = collection(db, 'products')

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    /** Ambil semua produk berstatus aktif (untuk katalog publik) */
    async fetchActive() {
      this.loading = true
      this.error = null
      try {
        const q = query(productsCol, where('status', '==', 'active'), orderBy('name'))
        const snap = await getDocs(q)
        this.items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    /** Ambil semua produk (untuk admin, termasuk non-aktif) */
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const q = query(productsCol, orderBy('name'))
        const snap = await getDocs(q)
        this.items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    /** Dipakai halaman publik: query harus ikut memfilter status agar sesuai security rules
     *  (rule membaca resource.data.status, jadi list query publik wajib memfilter field itu). */
    async fetchBySlug(slug) {
      const q = query(productsCol, where('slug', '==', slug), where('status', '==', 'active'))
      const snap = await getDocs(q)
      if (snap.empty) return null
      const d = snap.docs[0]
      return { id: d.id, ...d.data() }
    },
    async fetchById(id) {
      const snap = await getDoc(doc(db, 'products', id))
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    },
    async create(data, uid) {
      const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name)
      const payload = {
        ...data,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid ?? null,
      }
      const ref = await addDoc(productsCol, payload)
      return ref.id
    },
    async update(id, data) {
      const payload = { ...data, updatedAt: serverTimestamp() }
      if (data.slug) payload.slug = slugify(data.slug)
      await updateDoc(doc(db, 'products', id), payload)
    },
    async remove(id) {
      await deleteDoc(doc(db, 'products', id))
    },
  },
})
