import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth } from '@/plugins/firebase'

// Login Google hanya dipercaya untuk email ini — dibatasi lagi (dan ditegakkan
// sungguhan) lewat firestore.rules yang mengecek sign_in_provider + email.
const ALLOWED_GOOGLE_ADMIN_EMAILS = ['commercial.beraeikan@gmail.com']

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    ready: false,
    error: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    initAuthListener() {
      if (this._unsubscribe) return
      this._unsubscribe = onAuthStateChanged(auth, (user) => {
        this.user = user
        this.ready = true
      })
    },
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        this.user = cred.user
        return true
      } catch (err) {
        this.error = mapAuthError(err.code)
        return false
      } finally {
        this.loading = false
      }
    },
    async loginWithGoogle() {
      this.loading = true
      this.error = null
      try {
        const cred = await signInWithPopup(auth, new GoogleAuthProvider())
        if (!ALLOWED_GOOGLE_ADMIN_EMAILS.includes(cred.user.email)) {
          await signOut(auth)
          this.user = null
          this.error = 'Akun Google ini tidak memiliki akses admin.'
          return false
        }
        this.user = cred.user
        return true
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          this.error = 'Gagal masuk dengan Google. Silakan coba lagi.'
        }
        return false
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    /** Menunggu status auth pertama kali diketahui (dipakai di router guard) */
    waitUntilReady() {
      if (this.ready) return Promise.resolve()
      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, () => {
          unsub()
          resolve()
        })
      })
    },
    /** Ganti password akun admin yang sedang login. Perlu re-autentikasi dengan password lama. */
    async changePassword(currentPassword, newPassword) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
    },
  },
})

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau password salah.'
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Coba lagi beberapa saat.'
    default:
      return 'Gagal login. Silakan coba lagi.'
  }
}
