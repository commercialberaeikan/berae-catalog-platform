<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useBatchesStore } from '@/stores/batches'
import { categoryColor, categoryIcon, categoryLabel } from '@/utils/constants'
import NutritionFactsCards from '@/components/public/NutritionFactsCards.vue'
import PortionCalculator from '@/components/public/PortionCalculator.vue'
import TraceabilityTimeline from '@/components/public/TraceabilityTimeline.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const batchesStore = useBatchesStore()

const product = ref(null)
const batches = ref([])
const loading = ref(true)
const notFound = ref(false)
const activeImageIndex = ref(0)
const selectedBatch = ref(null)

function selectBatch(batch) {
  selectedBatch.value = selectedBatch.value?.id === batch.id ? null : batch
}

async function load(slug) {
  loading.value = true
  notFound.value = false
  activeImageIndex.value = 0
  selectedBatch.value = null
  try {
    const found = await productsStore.fetchBySlug(slug)
    if (!found) {
      notFound.value = true
      return
    }
    product.value = found
    batches.value = await batchesStore.fetchActiveByProduct(found.id)

    const targetBatchCode = route.query.batch
    if (targetBatchCode) {
      const target = batches.value.find((b) => b.batchCode === targetBatchCode)
      if (target) {
        selectedBatch.value = target
        await nextTick()
        document.getElementById('batch-produksi')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

function prevImage() {
  const total = product.value?.images?.length ?? 0
  if (total < 2) return
  activeImageIndex.value = (activeImageIndex.value - 1 + total) % total
}

function nextImage() {
  const total = product.value?.images?.length ?? 0
  if (total < 2) return
  activeImageIndex.value = (activeImageIndex.value + 1) % total
}

onMounted(() => load(route.params.slug))
watch(() => route.params.slug, (slug) => load(slug))
</script>

<template>
  <v-container class="py-12" v-if="loading">
    <div class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>

  <v-container class="py-12" v-else-if="notFound">
    <v-alert type="warning" variant="tonal" rounded="xl">Produk tidak ditemukan atau sudah tidak aktif.</v-alert>
    <v-btn class="mt-4" color="primary" rounded="pill" @click="router.push({ name: 'catalog-home' })">Kembali ke Katalog</v-btn>
  </v-container>

  <template v-else>
    <div class="hero-banner py-14 py-md-20 text-center position-relative">
      <v-btn
        variant="flat"
        prepend-icon="mdi-arrow-left"
        rounded="pill"
        size="small"
        class="back-btn-floating"
        @click="router.push({ name: 'catalog-home' })"
      >
        Kembali ke Katalog
      </v-btn>

      <v-container>
        <v-chip
          variant="elevated"
          color="surface"
          class="mb-3 font-weight-medium"
          :style="{ color: categoryColor(product.category) }"
          :prepend-icon="categoryIcon(product.category)"
        >
          {{ categoryLabel(product.category) }}
        </v-chip>
        <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2">{{ product.name }}</h1>
        <p v-if="product.species" class="text-body-1 text-white opacity-80 mb-0">{{ product.species }}</p>
      </v-container>
    </div>

    <div class="bg-white">
      <v-container class="py-8 py-md-12">
        <v-card variant="outlined" rounded="xl" class="pa-4 pa-md-6 mb-6">
          <v-row>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <div class="position-relative">
                <v-img
                  :src="product.images?.[activeImageIndex] ?? '/placeholder-fish.svg'"
                  rounded="xl"
                  aspect-ratio="1"
                  cover
                  class="bg-surface-variant"
                />
                <template v-if="(product.images?.length ?? 0) > 1">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="flat"
                    size="small"
                    class="image-nav-btn image-nav-left"
                    @click="prevImage"
                  />
                  <v-btn
                    icon="mdi-chevron-right"
                    variant="flat"
                    size="small"
                    class="image-nav-btn image-nav-right"
                    @click="nextImage"
                  />
                  <div class="image-dots">
                    <span
                      v-for="(img, i) in product.images"
                      :key="i"
                      class="image-dot"
                      :class="{ 'image-dot--active': i === activeImageIndex }"
                      @click="activeImageIndex = i"
                    />
                  </div>
                </template>
              </div>

              <v-card variant="outlined" rounded="xl" class="pa-4 mt-4 description-card flex-grow-1 d-flex flex-column position-relative">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-subtitle-1 font-weight-bold">Deskripsi Produk</span>
                  <v-chip
                    v-if="product.glazzingPercent != null"
                    color="#EAF0FD"
                    :style="{ color: '#2554C7' }"
                    prepend-icon="mdi-snowflake"
                    size="small"
                    class="font-weight-medium"
                  >
                    Glazzing {{ product.glazzingPercent }}%
                  </v-chip>
                </div>
                <p class="text-body-1 text-medium-emphasis mb-0">{{ product.description }}</p>

                <template v-if="product.specifications?.length">
                  <v-divider class="my-4" />
                  <div class="text-subtitle-1 font-weight-bold mb-3">Spesifikasi Produk</div>
                  <v-row dense>
                    <v-col v-for="(s, i) in product.specifications" :key="i" cols="6">
                      <div class="text-caption text-medium-emphasis">{{ s.label }}</div>
                      <div class="font-weight-medium">{{ s.value }}</div>
                    </v-col>
                  </v-row>
                </template>

                <div class="certification-label">
                  <v-icon icon="mdi-certificate-outline" size="14" class="mr-1" />
                  Sertifikasi: {{ product.certification || '-' }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="7" class="d-flex flex-column">
              <v-row dense>
                <v-col cols="12" lg="6">
                  <NutritionFactsCards v-if="product.nutritionFacts" :nutrition="product.nutritionFacts" />
                </v-col>
                <v-col cols="12" lg="6">
                  <PortionCalculator :glazzing-percent="product.glazzingPercent" :pack-size-grams="product.packSizeGrams" />
                </v-col>
              </v-row>

              <v-card variant="outlined" rounded="xl" class="pa-4 mt-4 flex-grow-1 d-flex flex-column">
                <div class="text-subtitle-1 font-weight-bold mb-3">Ide Resep</div>
                <v-row dense>
                  <v-col v-for="i in 2" :key="i" cols="6">
                    <template v-if="product.recipes?.[i - 1]">
                      <v-img
                        :src="product.recipes[i - 1].imageUrl || '/placeholder-fish.svg'"
                        aspect-ratio="1"
                        cover
                        rounded="lg"
                        class="bg-surface-variant mb-2"
                      />
                      <div class="text-caption font-weight-medium text-center recipe-title">{{ product.recipes[i - 1].title }}</div>
                    </template>
                    <div v-else class="recipe-empty-slot d-flex flex-column align-center justify-center text-center">
                      <v-icon icon="mdi-silverware-fork-knife" size="22" color="medium-emphasis" class="mb-1" />
                      <div class="text-caption text-medium-emphasis">Resep belum ditambahkan</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <v-divider class="my-10" />

        <h2 id="batch-produksi" class="text-h5 font-weight-bold mb-5">Batch Produksi Tersedia</h2>
        <v-alert v-if="!batches.length" type="info" variant="tonal" rounded="xl">
          Belum ada batch produksi aktif untuk produk ini.
        </v-alert>
        <v-row v-else>
          <v-col v-for="batch in batches" :key="batch.id" cols="12" sm="6" md="4">
            <v-card
              variant="outlined"
              rounded="xl"
              class="pa-2 batch-card"
              :class="{ 'batch-card--active': selectedBatch?.id === batch.id }"
              @click="selectBatch(batch)"
            >
              <v-card-item>
                <template #prepend>
                  <v-avatar color="#EAF0FD" rounded="xl" size="44" class="mr-2">
                    <v-icon icon="mdi-qrcode" color="#2554C7" />
                  </v-avatar>
                </template>
                <template #append>
                  <v-icon :icon="selectedBatch?.id === batch.id ? 'mdi-chevron-up' : 'mdi-chevron-down'" color="medium-emphasis" />
                </template>
                <v-card-title class="text-subtitle-1 font-weight-bold text-wrap" style="white-space: normal">{{ batch.batchCode }}</v-card-title>
                <v-card-subtitle>Lihat ketelusuran lengkap</v-card-subtitle>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <v-expand-transition>
          <v-card v-if="selectedBatch" variant="outlined" rounded="xl" class="pa-4 pa-md-6 mt-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center ga-2">
                <v-icon icon="mdi-map-marker-path" color="primary" />
                <span class="text-h6 font-weight-bold">Ketelusuran Batch {{ selectedBatch.batchCode }}</span>
              </div>
              <v-btn icon="mdi-close" variant="text" size="small" @click="selectedBatch = null" />
            </div>
            <TraceabilityTimeline :category="product.category" :batch="selectedBatch" />
          </v-card>
        </v-expand-transition>
      </v-container>
    </div>
  </template>
</template>

<style scoped>
.description-card {
  background-color: #ffffff;
}
.certification-label {
  position: absolute;
  bottom: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.back-btn-floating {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2;
  background-color: #ffffff !important;
  color: #111111 !important;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25) !important;
  transition: background-color 0.15s ease;
}
.back-btn-floating:hover {
  background-color: #f0f0f0 !important;
}
.batch-card {
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.batch-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-2px);
}
.batch-card--active {
  border-color: #2554c7 !important;
  background-color: #eaf0fd !important;
}
.image-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ffffff !important;
  color: #111111 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
}
.image-nav-left {
  left: 12px;
}
.image-nav-right {
  right: 12px;
}
.image-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.image-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.image-dot--active {
  background-color: #ffffff;
}
.recipe-empty-slot {
  aspect-ratio: 1;
  border: 1.5px dashed rgb(var(--v-theme-outline));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface-variant));
  padding: 8px;
}
.recipe-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.25;
}
</style>
