<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import WhatsAppWidget from '@/components/public/WhatsAppWidget.vue'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
onMounted(() => {
  theme.change('beraeLight')
})

const navItems = [
  { label: 'Katalog', to: { name: 'catalog-home' } },
  { label: 'Tentang Kami', to: { name: 'about-us' } },
  { label: 'Kontak', to: { name: 'contact' } },
  { label: 'Artikel', to: { name: 'articles' } },
  { label: 'Aktivitas Kami', to: { name: 'activities' } },
]

function navigate(item) {
  router.push(item.to)
}
</script>

<template>
  <v-app-bar color="surface" elevation="0" density="comfortable" class="border-b">
    <v-container class="nav-grid">
      <div class="nav-hamburger d-md-none">
        <v-menu location="bottom start">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-menu" variant="text" />
          </template>
          <v-list>
            <v-list-item v-for="item in navItems" :key="item.label" :title="item.label" @click="navigate(item)" />
          </v-list>
        </v-menu>
      </div>

      <div class="nav-logo" @click="navigate({ to: { name: 'catalog-home' } })">
        <img src="/logo-berae.png" alt="PT Berae Segara Nusantara" height="32" />
      </div>

      <nav class="nav-center d-none d-md-flex">
        <button
          v-for="item in navItems"
          :key="item.label"
          type="button"
          class="nav-link"
          :class="{ active: route.name === item.to.name }"
          @click="navigate(item)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="nav-right">
        <v-btn class="d-none d-md-inline-flex" variant="outlined" rounded="pill" prepend-icon="mdi-login" :to="{ name: 'admin-login' }">
          Login
        </v-btn>
        <v-btn class="d-md-none" icon="mdi-login" variant="outlined" size="small" :to="{ name: 'admin-login' }" />
      </div>
    </v-container>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

  <v-footer color="surface" class="border-t pa-0">
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <div class="d-flex align-center mb-3">
            <img src="/logo-berae.png" alt="PT Berae Segara Nusantara" height="36" />
          </div>
          <p class="text-body-2 text-medium-emphasis" style="max-width: 320px">
            Katalog & ketelusuran produk perikanan PT Berae Segara Nusantara — tangkapan, olahan, dan budidaya.
          </p>
        </v-col>
        <v-col cols="6" md="4">
          <div class="text-subtitle-2 font-weight-bold mb-3">Tentang</div>
          <div class="d-flex flex-column ga-2 text-body-2 text-medium-emphasis">
            <router-link v-for="item in navItems" :key="item.label" :to="item.to" class="footer-link">
              {{ item.label }}
            </router-link>
          </div>
        </v-col>
        <v-col cols="6" md="4">
          <div class="text-subtitle-2 font-weight-bold mb-3">Bantuan</div>
          <div class="d-flex flex-column ga-2 text-body-2 text-medium-emphasis">
            <span>Cara Scan QR Ketelusuran</span>
            <span>Pertanyaan Umum</span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-8" />
      <div class="d-flex flex-column flex-sm-row justify-space-between text-caption text-medium-emphasis ga-2">
        <span>&copy; {{ new Date().getFullYear() }} PT Berae Segara Nusantara. Seluruh hak cipta dilindungi.</span>
        <span>Produk Perikanan Tertelusuri</span>
      </div>
    </v-container>
  </v-footer>

  <WhatsAppWidget />
</template>

<style scoped>
.nav-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: 'logo center right';
  align-items: center;
}
.nav-hamburger {
  grid-area: hamburger;
  align-items: center;
}
.nav-logo {
  grid-area: logo;
  cursor: pointer;
  justify-self: start;
}
.nav-center {
  grid-area: center;
  justify-self: center;
  gap: 4px;
}
.nav-right {
  grid-area: right;
  justify-self: end;
  display: flex;
  align-items: center;
}

@media (max-width: 959.98px) {
  .nav-grid {
    grid-template-columns: auto auto 1fr auto;
    grid-template-areas: 'hamburger logo . right';
    column-gap: 4px;
  }
}
.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  color: rgba(17, 17, 17, 0.7);
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.nav-link:hover {
  background: rgb(var(--v-theme-surface-variant));
}
.nav-link.active {
  background: #fff;
  color: var(--nav-active-color, #2554c7);
  border: 2px solid var(--nav-active-color, #2554c7);
  padding: 6px 16px;
}
.footer-link {
  color: inherit;
  text-decoration: none;
}
.footer-link:hover {
  text-decoration: underline;
}
</style>
