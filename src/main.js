import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins/firebase'

import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')

// Vuetify mengukur lebar "notch" border pada text field outlined saat pertama
// render. Kalau font kustom (Google Sans Flex) belum selesai dimuat saat itu,
// ukuran notch bisa meleset dari lebar label sesungguhnya (label terlihat
// bertabrakan dengan border/isi field). Paksa Vuetify mengukur ulang begitu
// font selesai dimuat.
if (document.fonts) {
  document.fonts.ready.then(() => {
    window.dispatchEvent(new Event('resize'))
  })
}
