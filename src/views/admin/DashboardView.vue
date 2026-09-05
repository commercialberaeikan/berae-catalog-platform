<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBatchesStore } from '@/stores/batches'

const router = useRouter()
const productsStore = useProductsStore()
const batchesStore = useBatchesStore()

onMounted(() => {
  productsStore.fetchAll()
  batchesStore.fetchAll()
})

const activeProducts = computed(() => productsStore.items.filter((p) => p.status === 'active').length)
const activeBatches = computed(() => batchesStore.items.filter((b) => b.status === 'active').length)

const stats = computed(() => [
  { label: 'Total Produk', value: productsStore.items.length, icon: 'mdi-package-variant-closed', color: 'primary' },
  { label: 'Produk Aktif', value: activeProducts.value, icon: 'mdi-check-circle-outline', color: 'success' },
  { label: 'Total Batch', value: batchesStore.items.length, icon: 'mdi-barcode-scan', color: 'secondary' },
  { label: 'Batch Aktif', value: activeBatches.value, icon: 'mdi-check-circle-outline', color: 'success' },
])
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col v-for="s in stats" :key="s.label" cols="12" sm="6" md="3">
        <v-card variant="outlined" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption text-medium-emphasis">{{ s.label }}</span>
            <v-avatar :color="s.color" variant="tonal" size="32">
              <v-icon :icon="s.icon" size="18" :color="s.color" />
            </v-avatar>
          </div>
          <div class="text-h4 font-weight-bold">{{ s.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card class="pa-6" variant="outlined">
          <div class="text-subtitle-1 font-weight-medium mb-2">Kelola Katalog Produk</div>
          <p class="text-body-2 text-medium-emphasis mb-4">Daftarkan produk perikanan baru sebagai master data.</p>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'admin-product-new' })">
            Tambah Produk
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-6" variant="outlined">
          <div class="text-subtitle-1 font-weight-medium mb-2">Kelola Batch Produksi</div>
          <p class="text-body-2 text-medium-emphasis mb-4">Input data ketelusuran per batch & generate QR code.</p>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'admin-batch-new' })">
            Tambah Batch
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
