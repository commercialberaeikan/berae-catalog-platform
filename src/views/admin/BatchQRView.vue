<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBatchesStore } from '@/stores/batches'
import { useProductsStore } from '@/stores/products'
import QRCodeGenerator from '@/components/admin/QRCodeGenerator.vue'

const route = useRoute()
const router = useRouter()
const batchesStore = useBatchesStore()
const productsStore = useProductsStore()

const batch = ref(null)
const product = ref(null)
const loading = ref(true)

onMounted(async () => {
  batch.value = await batchesStore.fetchById(route.params.id)
  if (batch.value?.productId) {
    product.value = await productsStore.fetchById(batch.value.productId)
  }
  loading.value = false
})
</script>

<template>
  <v-container class="py-6" style="max-width: 600px">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push({ name: 'admin-batch-list' })" />
      <h1 class="text-h5 font-weight-bold">QR Code Batch</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="!batch" type="warning" variant="tonal">Batch tidak ditemukan.</v-alert>

    <template v-else>
      <v-card variant="outlined" class="pa-4 mb-4">
        <div class="text-subtitle-2 text-medium-emphasis">Produk</div>
        <div class="text-h6">{{ batch.productSnapshot?.name }}</div>
        <div class="text-subtitle-2 text-medium-emphasis mt-2">Kode Batch</div>
        <div class="text-h6">{{ batch.batchCode }}</div>
      </v-card>

      <QRCodeGenerator
        :batch-code="batch.batchCode"
        :product-name="batch.productSnapshot?.name"
        :pack-size-grams="product?.packSizeGrams"
        :production-date="batch.productionDate"
        :expiry-date="batch.expiryDate"
      />

      <v-alert type="info" variant="tonal" class="mt-4">
        Cetak QR code ini dan tempelkan pada kemasan produk. Saat customer men-scan, mereka akan langsung diarahkan ke halaman ketelusuran batch ini.
      </v-alert>
    </template>
  </v-container>
</template>
