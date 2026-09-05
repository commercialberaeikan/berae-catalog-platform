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

const batchesCol = collection(db, 'batches')

export const useBatchesStore = defineStore('batches', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const q = query(batchesCol, orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        this.items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchActiveByProduct(productId) {
      const q = query(
        batchesCol,
        where('productId', '==', productId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    },
    /** Dipakai halaman publik (tujuan QR code): query harus ikut memfilter status agar sesuai
     *  security rules (rule membaca resource.data.status, jadi list query publik wajib memfilter field itu). */
    async fetchByBatchCode(batchCode) {
      const q = query(batchesCol, where('batchCode', '==', batchCode), where('status', '==', 'active'))
      const snap = await getDocs(q)
      if (snap.empty) return null
      const d = snap.docs[0]
      return { id: d.id, ...d.data() }
    },
    async fetchById(id) {
      const snap = await getDoc(doc(db, 'batches', id))
      return snap.exists() ? { id: snap.id, ...snap.data() } : null
    },
    async create(data, uid) {
      const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: uid ?? null,
      }
      const ref = await addDoc(batchesCol, payload)
      return ref.id
    },
    async update(id, data) {
      await updateDoc(doc(db, 'batches', id), { ...data, updatedAt: serverTimestamp() })
    },
    async remove(id) {
      await deleteDoc(doc(db, 'batches', id))
    },
  },
})
