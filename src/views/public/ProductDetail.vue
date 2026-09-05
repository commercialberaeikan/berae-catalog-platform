<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBatchesStore } from '@/stores/batches'
import { categoryColor, categoryIcon, categoryLabel } from '@/utils/constants'
import NutritionFactsTable from '@/components/public/NutritionFactsTable.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const batchesStore = useBatchesStore()

const product = ref(null)
const batches = ref([])
const loading = ref(true)
const notFound = ref(false)

async function load(slug) {
  loading.value = true
  notFound.value = false
  try {
    const found = await productsStore.fetchBySlug(slug)
    if (!found) {
      notFound.value = true
      return
    }
    product.value = found
    batches.value = await batchesStore.fetchActiveByProduct(found.id)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => load(route.params.slug))
watch(() => route.params.slug, (slug) => load(slug))
</script>

<template>
  <v-container class="py-8" v-if="loading">
    <div class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>

  <v-container class="py-8" v-else-if="notFound">
    <v-alert type="warning" variant="tonal">Produk tidak ditemukan atau sudah tidak aktif.</v-alert>
    <v-btn class="mt-4" color="primary" @click="router.push({ name: 'catalog-home' })">Kembali ke Katalog</v-btn>
  </v-container>

  <v-container class="py-8" v-else>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="router.push({ name: 'catalog-home' })">
      Kembali
    </v-btn>

    <v-row>
      <v-col cols="12" md="5">
        <v-img :src="product.images?.[0] ?? '/placeholder-fish.svg'" rounded="xl" aspect-ratio="1" cover class="bg-surface-variant" />
      </v-col>
      <v-col cols="12" md="7">
        <v-chip :color="categoryColor(product.category)" :prepend-icon="categoryIcon(product.category)" variant="tonal" class="mb-2">
          {{ categoryLabel(product.category) }}
        </v-chip>
        <h1 class="text-h4 font-weight-bold mb-1">{{ product.name }}</h1>
        <div v-if="product.species" class="text-subtitle-1 text-medium-emphasis mb-4">{{ product.species }}</div>
        <p class="text-body-1 mb-6">{{ product.description }}</p>

        <NutritionFactsTable v-if="product.nutritionFacts" :nutrition="product.nutritionFacts" class="mb-6" />
      </v-col>
    </v-row>

    <v-divider class="my-8" />

    <h2 class="text-h6 mb-4">Batch Produksi Tersedia</h2>
    <v-alert v-if="!batches.length" type="info" variant="tonal">
      Belum ada batch produksi aktif untuk produk ini.
    </v-alert>
    <v-row v-else>
      <v-col v-for="batch in batches" :key="batch.id" cols="12" sm="6" md="4">
        <v-card
          variant="outlined"
          rounded="xl"
          class="pa-2"
          @click="router.push({ name: 'batch-traceability', params: { batchCode: batch.batchCode } })"
        >
          <v-card-item>
            <template #append><v-icon icon="mdi-chevron-right" /></template>
            <v-card-title class="text-subtitle-1 font-weight-bold text-wrap" style="white-space: normal">{{ batch.batchCode }}</v-card-title>
            <v-card-subtitle>Lihat ketelusuran lengkap</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
