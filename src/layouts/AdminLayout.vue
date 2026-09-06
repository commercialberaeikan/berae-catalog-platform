<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import CompanyProfileDialog from '@/components/admin/CompanyProfileDialog.vue'
import ChangePasswordDialog from '@/components/admin/ChangePasswordDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const theme = useTheme()

const rail = ref(false)
const showCompanyDialog = ref(false)
const showPasswordDialog = ref(false)

onMounted(() => {
  theme.change('beraeAdminLight')
})

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: { name: 'admin-dashboard' } },
  { title: 'Katalog Produk', icon: 'mdi-package-variant-closed', to: { name: 'admin-product-list' } },
  { title: 'Batch Produksi', icon: 'mdi-barcode-scan', to: { name: 'admin-batch-list' } },
]
const previewItem = { title: 'Lihat sebagai Customer', icon: 'mdi-eye-outline', to: { name: 'admin-preview' } }

const displayName = computed(() => authStore.user?.email ?? '')
const avatarInitial = computed(() => displayName.value.charAt(0).toUpperCase() || '?')

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <v-navigation-drawer :rail="rail" permanent rail-width="72" width="240" class="admin-drawer">
    <div class="d-flex align-center justify-center" style="height: 84px">
      <img v-if="rail" src="/logo-berae-icon.png" alt="Berae" height="36" />
      <img v-else src="/logo-berae.png" alt="PT Berae Segara Nusantara" width="168" height="58" style="object-fit: contain" />
    </div>
    <v-divider />

    <div v-if="!rail" class="nav-section-label px-4 pt-4 pb-1">Menu Utama</div>
    <v-list nav density="comfortable" class="pa-2">
      <v-tooltip
        v-for="item in navItems"
        :key="item.title"
        :text="item.title"
        location="end"
        :offset="12"
        :disabled="!rail"
        content-class="admin-nav-tooltip"
      >
        <template #activator="{ props: tooltipProps }">
          <v-list-item
            v-bind="tooltipProps"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="rail ? undefined : item.title"
            rounded="xl"
            class="mb-2 nav-item"
            color="primary"
          />
        </template>
      </v-tooltip>
    </v-list>

    <v-divider class="mx-2" />

    <v-list nav density="comfortable" class="pa-2">
      <v-tooltip :text="previewItem.title" location="end" :offset="12" :disabled="!rail" content-class="admin-nav-tooltip">
        <template #activator="{ props: tooltipProps }">
          <v-list-item
            v-bind="tooltipProps"
            :to="previewItem.to"
            :prepend-icon="previewItem.icon"
            :title="rail ? undefined : previewItem.title"
            rounded="xl"
            class="nav-item"
            color="primary"
          />
        </template>
      </v-tooltip>
    </v-list>

    <template #append>
      <div class="pa-2">
        <v-btn
          v-if="rail"
          icon="mdi-chevron-right"
          variant="outlined"
          size="small"
          class="collapse-toggle"
          @click="rail = false"
        />
        <v-btn
          v-else
          variant="outlined"
          rounded="pill"
          block
          class="collapse-toggle"
          prepend-icon="mdi-chevron-left"
          @click="rail = true"
        >
          <span class="font-weight-bold">Perkecil menu</span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-main class="bg-background">
    <div class="admin-header d-flex align-center justify-space-between px-6 border-b bg-surface">
      <div>
        <div class="text-h6 font-weight-bold">{{ route.meta.title ?? 'Admin' }}</div>
        <div v-if="route.meta.subtitle" class="text-caption text-medium-emphasis">{{ route.meta.subtitle }}</div>
      </div>
      <div class="d-flex align-center ga-4">
        <v-menu>
          <template #activator="{ props: menuProps }">
            <div v-bind="menuProps" class="account-trigger d-flex align-center ga-2">
              <v-avatar color="primary" size="32">
                <span class="text-caption font-weight-bold text-white">{{ avatarInitial }}</span>
              </v-avatar>
              <span class="text-body-2 font-weight-bold d-none d-md-inline">{{ displayName }}</span>
              <v-icon icon="mdi-chevron-down" size="16" class="d-none d-md-inline" />
            </div>
          </template>
          <v-card rounded="xl" min-width="230" class="pa-2 mt-2">
            <v-list density="comfortable" nav>
              <v-list-item
                prepend-icon="mdi-domain"
                title="Profil perusahaan"
                rounded="lg"
                @click="showCompanyDialog = true"
              />
              <v-list-item
                prepend-icon="mdi-key-outline"
                title="Ubah kata sandi"
                rounded="lg"
                @click="showPasswordDialog = true"
              />
              <v-divider class="my-1" />
              <v-list-item
                prepend-icon="mdi-logout-variant"
                title="Keluar"
                rounded="lg"
                base-color="error"
                @click="handleLogout"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>

    <router-view />
  </v-main>

  <CompanyProfileDialog v-model="showCompanyDialog" />
  <ChangePasswordDialog v-model="showPasswordDialog" />
</template>

<style scoped>
.admin-header {
  height: 64px;
}
.admin-drawer {
  border-inline-end: 1px solid rgb(var(--v-theme-outline)) !important;
}
.admin-drawer :deep(.v-list-item-title) {
  font-size: 14px;
  font-weight: 700;
}
.nav-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.5;
}
.admin-drawer :deep(.nav-item) {
  min-height: 48px;
}
.admin-drawer :deep(.nav-item.v-list-item--active) {
  border: 2px solid rgb(var(--v-theme-primary));
}
.admin-drawer.v-navigation-drawer--rail :deep(.nav-item) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding-inline: 0 !important;
  width: 48px;
  min-width: 48px;
  margin-inline: auto;
}
.admin-drawer.v-navigation-drawer--rail :deep(.nav-item .v-list-item__prepend) {
  margin-inline-end: 0 !important;
}
.admin-drawer.v-navigation-drawer--rail :deep(.nav-item .v-list-item__spacer) {
  display: none !important;
  width: 0 !important;
}
.collapse-toggle {
  border-color: rgb(var(--v-theme-outline)) !important;
  color: rgb(var(--v-theme-on-surface));
}
.account-trigger {
  cursor: pointer;
  padding: 4px 14px 4px 6px;
  border-radius: 999px;
  border: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface-variant));
  transition: background-color 0.15s ease;
}
.account-trigger:hover {
  background: rgb(var(--v-theme-primary-container));
}
:deep(.admin-nav-tooltip) {
  background: #1e2430 !important;
  color: #ffffff !important;
  opacity: 1 !important;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
}
</style>
