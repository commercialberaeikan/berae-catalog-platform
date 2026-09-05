<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBatchesStore } from '@/stores/batches'
import { useProductsStore } from '@/stores/products'

// Halaman ini sudah tidak dipakai sebagai tampilan ketelusuran sendiri — sejak
// ketelusuran batch ditampilkan inline di halaman produk (ProductDetail.vue),
// route ini hanya jadi jembatan redirect. Dipertahankan (bukan dihapus) supaya
// QR code yang sudah tercetak sebelumnya (mengarah ke /batch/:batchCode) tetap
// berfungsi dan otomatis diarahkan ke pengalaman baru, tanpa perlu cetak ulang.

const route = useRoute()
const router = useRouter()
const batchesStore = useBatchesStore()
const productsStore = useProductsStore()

const notFound = ref(false)

async function load(batchCode) {
  notFound.value = false
  try {
    const foundBatch = await batchesStore.fetchByBatchCode(batchCode)
    if (!foundBatch) {
      notFound.value = true
      return
    }
    let slug = foundBatch.productSnapshot?.slug
    if (!slug) {
      const product = await productsStore.fetchById(foundBatch.productId)
      slug = product?.slug
    }
    if (!slug) {
      notFound.value = true
      return
    }
    router.replace({ name: 'product-detail', params: { slug }, query: { batch: batchCode } })
  } catch {
    notFound.value = true
  }
}

onMounted(() => load(route.params.batchCode))
watch(() => route.params.batchCode, (code) => load(code))
</script>

<template>
  <v-container class="py-12" v-if="notFound">
    <v-alert type="warning" variant="tonal" icon="mdi-alert-circle" rounded="xl">
      Kode batch tidak ditemukan atau produk sudah tidak tersedia.
    </v-alert>
    <v-btn class="mt-4" color="primary" rounded="pill" @click="router.push({ name: 'catalog-home' })">Ke Katalog Produk</v-btn>
  </v-container>

  <v-container class="py-12" v-else>
    <div class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>
</template>
