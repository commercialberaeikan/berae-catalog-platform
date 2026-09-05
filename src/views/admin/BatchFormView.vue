<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBatchesStore } from '@/stores/batches'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import {
  BATCH_STATUS,
  emptyCapture,
  emptyProcessing,
  emptyAquaculture,
  generateBatchCode,
} from '@/utils/constants'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import TraceabilityFormTangkapan from '@/components/admin/TraceabilityFormTangkapan.vue'
import TraceabilityFormOlahan from '@/components/admin/TraceabilityFormOlahan.vue'
import TraceabilityFormBudidaya from '@/components/admin/TraceabilityFormBudidaya.vue'

const route = useRoute()
const router = useRouter()
const batchesStore = useBatchesStore()
const productsStore = useProductsStore()
const authStore = useAuthStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const loading = ref(true)
const error = ref(null)

const form = reactive({
  productId: null,
  batchCode: '',
  status: 'active',
  photos: [],
  capture: emptyCapture(),
  processing: emptyProcessing(),
  aquaculture: emptyAquaculture(),
})

const selectedProduct = computed(() => productsStore.items.find((p) => p.id === form.productId))
const category = computed(() => selectedProduct.value?.category ?? null)

onMounted(async () => {
  await productsStore.fetchAll()
  if (isEdit.value) {
    const existing = await batchesStore.fetchById(route.params.id)
    if (!existing) {
      error.value = 'Batch tidak ditemukan.'
    } else {
      Object.assign(form, {
        ...existing,
        capture: { ...emptyCapture(), ...(existing.capture ?? {}) },
        processing: { ...emptyProcessing(), ...(existing.processing ?? {}) },
        aquaculture: { ...emptyAquaculture(), ...(existing.aquaculture ?? {}) },
      })
    }
  }
  loading.value = false
})

// Saat produk dipilih pertama kali (mode tambah), auto-generate kode batch sesuai kategori
watch(category, (cat) => {
  if (!isEdit.value && cat && !form.batchCode) {
    form.batchCode = generateBatchCode(cat)
  }
})

async function handleSubmit() {
  if (!form.productId) {
    error.value = 'Pilih produk terlebih dahulu.'
    return
  }
  saving.value = true
  error.value = null
  try {
    const payload = {
      productId: form.productId,
      productSnapshot: {
        name: selectedProduct.value.name,
        category: selectedProduct.value.category,
        slug: selectedProduct.value.slug,
      },
      batchCode: form.batchCode,
      status: form.status,
      photos: form.photos,
    }
    if (category.value === 'tangkapan') payload.capture = form.capture
    if (category.value === 'olahan') {
      payload.capture = form.capture
      payload.processing = form.processing
    }
    if (category.value === 'budidaya') payload.aquaculture = form.aquaculture

    if (isEdit.value) {
      await batchesStore.update(route.params.id, payload)
      router.push({ name: 'admin-batch-list' })
    } else {
      const id = await batchesStore.create(payload, authStore.user?.uid)
      router.push({ name: 'admin-batch-qr', params: { id } })
    }
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-container class="py-6" style="max-width: 900px">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push({ name: 'admin-batch-list' })" />
      <h1 class="text-h5 font-weight-bold">{{ isEdit ? 'Edit Batch Produksi' : 'Tambah Batch Produksi' }}</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-form v-else @submit.prevent="handleSubmit">
      <v-card variant="outlined" class="pa-6 mb-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.productId"
              :items="productsStore.items"
              item-title="name"
              item-value="id"
              label="Produk"
              :disabled="isEdit"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="form.batchCode" label="Kode Batch" hint="Dipakai di URL QR code" persistent-hint required />
          </v-col>
          <v-col cols="12" md="2">
            <v-select v-model="form.status" :items="BATCH_STATUS" item-title="title" item-value="value" label="Status" />
          </v-col>
        </v-row>

        <ImageUploader v-model="form.photos" label="Foto Batch (opsional, fallback ke foto produk)" />
      </v-card>

      <v-card v-if="category" variant="outlined" class="pa-6 mb-4">
        <div class="text-subtitle-1 font-weight-medium mb-4">Data Ketelusuran</div>
        <TraceabilityFormTangkapan v-if="category === 'tangkapan'" v-model="form.capture" />
        <TraceabilityFormOlahan v-else-if="category === 'olahan'" :capture="form.capture" :processing="form.processing" />
        <TraceabilityFormBudidaya v-else-if="category === 'budidaya'" v-model="form.aquaculture" />
      </v-card>
      <v-alert v-else type="info" variant="tonal" class="mb-4">Pilih produk untuk menampilkan form ketelusuran sesuai kategorinya.</v-alert>

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-btn type="submit" color="primary" size="large" :loading="saving">Simpan Batch</v-btn>
    </v-form>
  </v-container>
</template>
