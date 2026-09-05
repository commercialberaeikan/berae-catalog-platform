<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.fetchCompany()
})
</script>

<template>
  <div class="hero-banner py-14 py-md-20 text-center">
    <v-container>
      <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-3">Kontak</h1>
      <p class="text-body-1 text-white opacity-80 mb-0 mx-auto" style="max-width: 560px">
        Ada pertanyaan tentang produk atau kerja sama? Hubungi kami.
      </p>
    </v-container>
  </div>

  <v-container class="py-10 py-md-14" style="max-width: 700px">
    <div v-if="settingsStore.loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-card v-else variant="outlined" class="pa-6 pa-md-8">
      <div class="text-h6 font-weight-bold mb-1">
        {{ settingsStore.company?.name || 'PT Berae Segara Nusantara' }}
      </div>
      <p class="text-body-2 text-medium-emphasis mb-6">Produk Perikanan Tertelusuri</p>

      <v-list density="comfortable" class="bg-transparent">
        <v-list-item v-if="settingsStore.company?.address" prepend-icon="mdi-map-marker-outline">
          <v-list-item-title>Alamat</v-list-item-title>
          <v-list-item-subtitle class="text-wrap">{{ settingsStore.company.address }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="settingsStore.company?.email" prepend-icon="mdi-email-outline">
          <v-list-item-title>Email</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="`mailto:${settingsStore.company.email}`" class="text-decoration-none">{{ settingsStore.company.email }}</a>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="settingsStore.company?.phone" prepend-icon="mdi-phone-outline">
          <v-list-item-title>Telepon</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="`tel:${settingsStore.company.phone}`" class="text-decoration-none">{{ settingsStore.company.phone }}</a>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-alert
        v-if="!settingsStore.company?.address && !settingsStore.company?.email && !settingsStore.company?.phone"
        type="info"
        variant="tonal"
        class="mt-2"
      >
        Informasi kontak belum diisi oleh admin.
      </v-alert>
    </v-card>
  </v-container>
</template>
