<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { PRODUCT_CATEGORIES, PRODUCT_STATUS, emptyNutritionFacts, slugify } from '@/utils/constants'
import ImageUploader from '@/components/admin/ImageUploader.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const authStore = useAuthStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const loading = ref(isEdit.value)
const error = ref(null)

const form = reactive({
  name: '',
  slug: '',
  category: 'tangkapan',
  species: '',
  description: '',
  images: [],
  status: 'active',
  nutritionFacts: emptyNutritionFacts(),
})

onMounted(async () => {
  if (isEdit.value) {
    const existing = await productsStore.fetchById(route.params.id)
    if (!existing) {
      error.value = 'Produk tidak ditemukan.'
    } else {
      Object.assign(form, {
        ...existing,
        nutritionFacts: { ...emptyNutritionFacts(), ...(existing.nutritionFacts ?? {}) },
      })
    }
    loading.value = false
  }
})

function addOtherNutrient() {
  form.nutritionFacts.others.push({ label: '', value: '', unit: '' })
}
function removeOtherNutrient(i) {
  form.nutritionFacts.others.splice(i, 1)
}

async function handleSubmit() {
  saving.value = true
  error.value = null
  try {
    const slug = form.slug?.trim() ? slugify(form.slug) : slugify(form.name)
    const payload = { ...form, slug }
    if (isEdit.value) {
      await productsStore.update(route.params.id, payload)
    } else {
      await productsStore.create(payload, authStore.user?.uid)
    }
    router.push({ name: 'admin-product-list' })
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
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push({ name: 'admin-product-list' })" />
      <h1 class="text-h5 font-weight-bold">{{ isEdit ? 'Edit Produk' : 'Tambah Produk' }}</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-form v-else @submit.prevent="handleSubmit">
      <v-card variant="outlined" class="pa-6 mb-4">
        <div class="text-subtitle-1 font-weight-medium mb-4">Informasi Umum</div>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.name" label="Nama Produk" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.slug" label="Slug URL (opsional, otomatis dari nama)" hint="mis. tuna-segar" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.category" :items="PRODUCT_CATEGORIES" item-title="title" item-value="value" label="Kategori Produk" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.species" label="Spesies / Nama Ikan" placeholder="mis. Thunnus albacares" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="form.description" label="Deskripsi Produk" rows="4" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.status" :items="PRODUCT_STATUS" item-title="title" item-value="value" label="Status" />
          </v-col>
        </v-row>

        <ImageUploader v-model="form.images" label="Foto Produk" />
      </v-card>

      <v-card variant="outlined" class="pa-6 mb-4">
        <div class="text-subtitle-1 font-weight-medium mb-4">Informasi Nilai Gizi</div>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.nutritionFacts.servingSize" label="Takaran saji" placeholder="mis. 100 gram" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.number="form.nutritionFacts.calories" label="Energi (kkal)" type="number" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model.number="form.nutritionFacts.protein" label="Protein (g)" type="number" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model.number="form.nutritionFacts.fat" label="Lemak (g)" type="number" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model.number="form.nutritionFacts.carbs" label="Karbohidrat (g)" type="number" />
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-subtitle-2">Nutrisi Lainnya</div>
          <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addOtherNutrient">Tambah</v-btn>
        </div>
        <v-row v-for="(o, i) in form.nutritionFacts.others" :key="i" dense>
          <v-col cols="5"><v-text-field v-model="o.label" label="Nama" density="compact" /></v-col>
          <v-col cols="4"><v-text-field v-model="o.value" label="Nilai" density="compact" /></v-col>
          <v-col cols="2"><v-text-field v-model="o.unit" label="Satuan" density="compact" /></v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removeOtherNutrient(i)" />
          </v-col>
        </v-row>
      </v-card>

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-btn type="submit" color="primary" size="large" :loading="saving">Simpan Produk</v-btn>
    </v-form>
  </v-container>
</template>
