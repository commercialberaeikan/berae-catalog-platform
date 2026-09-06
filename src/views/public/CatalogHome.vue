<script setup>
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import { PRODUCT_CATEGORIES } from '@/utils/constants'
import ProductCard from '@/components/public/ProductCard.vue'

const productsStore = useProductsStore()
const search = ref('')
const category = ref(null)
const page = ref(1)
const perPage = 12

onMounted(() => {
  productsStore.fetchActive()
})

const filtered = computed(() => {
  return productsStore.items.filter((p) => {
    const matchesCategory = !category.value || p.category === category.value
    const matchesSearch =
      !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.species?.toLowerCase().includes(search.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

watch([search, category], () => { page.value = 1 })

function countFor(categoryValue) {
  return productsStore.items.filter((p) => p.category === categoryValue).length
}

function selectCategory(value) {
  category.value = value
}

const recommended = computed(() => productsStore.items.slice(0, 8))
const carouselEl = useTemplateRef('carousel')
function scrollCarousel(direction) {
  carouselEl.value?.scrollBy({ left: direction * 280, behavior: 'smooth' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="hero-banner py-14 py-md-20 text-center">
    <v-container>
      <h1 class="hero-title text-white font-weight-bold mb-3">Katalog Produk Perikanan</h1>
      <p class="text-body-1 text-white opacity-80 mb-0 mx-auto" style="max-width: 520px">
        Telusuri produk kami — dari tangkapan, olahan, hingga budidaya — lengkap dengan jejak ketelusurannya.
      </p>
    </v-container>
  </div>

  <v-container style="margin-top: -40px; position: relative; z-index: 2">
    <v-card class="pa-4 pa-md-6" elevation="6" rounded="xl">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="4" class="mb-3 mb-md-0">
          <div class="text-subtitle-1 font-weight-bold">Yuk, temukan produk perikanan segar favorit Anda!</div>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="search"
            placeholder="Cari nama produk atau spesies..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            rounded="pill"
            clearable
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <div class="bg-white">
  <v-container class="py-8 py-md-12">
    <v-row>
      <v-col cols="12" md="3" xl="2">
        <div class="text-subtitle-1 font-weight-bold mb-3">Kategori</div>
        <v-list nav density="comfortable" class="pa-0 bg-transparent category-list">
          <v-list-item
            rounded="xl"
            class="mb-1"
            :active="!category"
            color="#2554C7"
            @click="selectCategory(null)"
          >
            <template #prepend><v-icon icon="mdi-view-grid-outline" size="22" /></template>
            <v-list-item-title>Semua Produk</v-list-item-title>
            <template #append>
              <v-chip size="small" variant="tonal">{{ productsStore.items.length }}</v-chip>
            </template>
          </v-list-item>
          <v-list-item
            v-for="c in PRODUCT_CATEGORIES"
            :key="c.value"
            rounded="xl"
            class="mb-1"
            :active="category === c.value"
            color="#2554C7"
            @click="selectCategory(c.value)"
          >
            <template #prepend><v-icon :icon="c.icon" size="22" /></template>
            <v-list-item-title>{{ c.title }}</v-list-item-title>
            <template #append>
              <v-chip size="small" variant="tonal">{{ countFor(c.value) }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="9" xl="10">
        <v-row v-if="productsStore.loading">
          <v-col cols="12" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else-if="!paged.length">
          <v-col cols="12" class="text-center py-12 text-medium-emphasis">
            <v-icon icon="mdi-fish-off" size="48" class="mb-2" />
            <div>Belum ada produk yang cocok.</div>
          </v-col>
        </v-row>

        <template v-else>
          <v-row>
            <v-col v-for="product in paged" :key="product.id" cols="12" sm="6" md="4" lg="3">
              <ProductCard :product="product" />
            </v-col>
          </v-row>

          <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
            <v-pagination v-model="page" :length="totalPages" :total-visible="5" density="comfortable" />
          </div>
        </template>
      </v-col>
    </v-row>
  </v-container>
  </div>

  <v-container v-if="recommended.length > 3" class="py-8 py-md-12">
    <div class="d-flex justify-space-between align-center mb-5">
      <h2 class="text-h5 font-weight-bold mb-0">Produk Pilihan</h2>
      <div class="d-flex ga-2">
        <v-btn icon="mdi-chevron-left" variant="outlined" density="comfortable" @click="scrollCarousel(-1)" />
        <v-btn icon="mdi-chevron-right" variant="outlined" density="comfortable" @click="scrollCarousel(1)" />
      </div>
    </div>
    <div ref="carousel" class="d-flex ga-4 carousel-row">
      <div v-for="product in recommended" :key="product.id" class="carousel-item">
        <ProductCard :product="product" />
      </div>
    </div>
  </v-container>

  <v-sheet class="cta-section py-10 py-md-14">
    <v-container class="d-flex flex-column flex-md-row justify-space-between align-center ga-6">
      <div class="text-center text-md-start">
        <h2 class="text-h5 text-md-h4 font-weight-bold text-white mb-2">Ingin Tahu Ketelusuran Produk Kami?</h2>
        <p class="text-body-1 text-white opacity-80 mb-0 mx-auto mx-md-0" style="max-width: 480px">
          Scan QR code di kemasan produk untuk melihat asal, proses, dan sertifikasi lengkapnya sebelum membeli.
        </p>
      </div>
      <v-btn color="white" size="large" rounded="pill" @click="scrollToTop">Lihat Semua Produk</v-btn>
    </v-container>
  </v-sheet>
</template>

<style scoped>
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
}
.category-list :deep(.v-list-item-title) {
  font-size: 12.5px;
  white-space: normal;
  line-height: 1.3;
  overflow-wrap: normal;
  word-break: keep-all;
}
.category-list :deep(.v-list-item) {
  min-height: 52px;
}
.cta-section {
  background:
    linear-gradient(rgba(6, 20, 28, 0.55), rgba(6, 20, 28, 0.65)),
    url('/cta-bg.jpg') center / cover no-repeat;
}
.carousel-row {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
}
.carousel-item {
  min-width: 260px;
  max-width: 260px;
  scroll-snap-align: start;
}
</style>
