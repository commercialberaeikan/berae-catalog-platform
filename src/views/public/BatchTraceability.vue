<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBatchesStore } from '@/stores/batches'
import { useProductsStore } from '@/stores/products'
import { categoryColor, categoryIcon, categoryLabel } from '@/utils/constants'
import NutritionFactsTable from '@/components/public/NutritionFactsTable.vue'
import TraceabilityTimeline from '@/components/public/TraceabilityTimeline.vue'

const route = useRoute()
const router = useRouter()
const batchesStore = useBatchesStore()
const productsStore = useProductsStore()

const batch = ref(null)
const product = ref(null)
const loading = ref(true)
const notFound = ref(false)

async function load(batchCode) {
  loading.value = true
  notFound.value = false
  try {
    const foundBatch = await batchesStore.fetchByBatchCode(batchCode)
    if (!foundBatch) {
      notFound.value = true
      return
    }
    batch.value = foundBatch
    product.value = await productsStore.fetchById(foundBatch.productId)
    if (!product.value || product.value.status !== 'active') {
      notFound.value = true
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => load(route.params.batchCode))
watch(() => route.params.batchCode, (code) => load(code))
</script>

<template>
  <v-container class="py-8" v-if="loading">
    <div class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>

  <v-container class="py-8" v-else-if="notFound">
    <v-alert type="warning" variant="tonal" icon="mdi-alert-circle">
      Kode batch tidak ditemukan atau produk sudah tidak tersedia.
    </v-alert>
    <v-btn class="mt-4" color="primary" @click="router.push({ name: 'catalog-home' })">Ke Katalog Produk</v-btn>
  </v-container>

  <v-container class="py-6" v-else>
    <v-chip size="small" variant="tonal" prepend-icon="mdi-barcode" class="mb-4">
      {{ batch.batchCode }}
    </v-chip>

    <v-row>
      <v-col cols="12" md="5">
        <v-carousel
          v-if="(batch.photos?.length || product.images?.length)"
          height="320"
          hide-delimiter-background
          show-arrows="hover"
          class="rounded-xl overflow-hidden"
        >
          <v-carousel-item
            v-for="(img, i) in (batch.photos?.length ? batch.photos : product.images)"
            :key="i"
            :src="img"
            cover
          />
        </v-carousel>
        <v-img v-else src="/placeholder-fish.svg" height="320" rounded="xl" cover class="bg-surface-variant" />
      </v-col>
      <v-col cols="12" md="7">
        <v-chip :color="categoryColor(product.category)" :prepend-icon="categoryIcon(product.category)" variant="tonal" class="mb-2">
          {{ categoryLabel(product.category) }}
        </v-chip>
        <h1 class="text-h4 font-weight-bold mb-1">{{ product.name }}</h1>
        <div v-if="product.species" class="text-subtitle-1 text-medium-emphasis mb-4">{{ product.species }}</div>
        <p class="text-body-1">{{ product.description }}</p>
      </v-col>
    </v-row>

    <v-divider class="my-8" />

    <v-row>
      <v-col cols="12" md="5">
        <NutritionFactsTable v-if="product.nutritionFacts" :nutrition="product.nutritionFacts" />
      </v-col>
      <v-col cols="12" md="7">
        <h2 class="text-h6 mb-4 d-flex align-center">
          <v-icon icon="mdi-map-marker-path" color="primary" class="mr-2" />
          Ketelusuran Produk
        </h2>
        <TraceabilityTimeline :category="product.category" :batch="batch" />
      </v-col>
    </v-row>
  </v-container>
</template>
