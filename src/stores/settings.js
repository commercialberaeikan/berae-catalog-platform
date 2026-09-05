import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/plugins/firebase'

const companyDocRef = doc(db, 'settings', 'company')

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    company: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCompany() {
      this.loading = true
      this.error = null
      try {
        const snap = await getDoc(companyDocRef)
        this.company = snap.exists() ? snap.data() : {}
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async saveCompany(data) {
      await setDoc(companyDocRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
      this.company = { ...this.company, ...data }
    },
  },
})
