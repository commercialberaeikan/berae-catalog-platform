<script setup>
import { useRouter } from 'vue-router'
import { categoryColor, categoryIcon, categoryLabel } from '@/utils/constants'

const props = defineProps({
  product: { type: Object, required: true },
})

const router = useRouter()

function open() {
  router.push({ name: 'product-detail', params: { slug: props.product.slug } })
}
</script>

<template>
  <v-card class="h-100 d-flex flex-column product-card" elevation="0" border rounded="xl">
    <div class="position-relative">
      <v-img
        :src="product.images?.[0] ?? '/placeholder-fish.svg'"
        aspect-ratio="1"
        cover
        rounded="xl"
        class="bg-surface-variant ma-2"
        style="border-radius: 20px"
      />
      <v-chip
        size="small"
        variant="elevated"
        color="surface"
        class="position-absolute font-weight-medium"
        style="top: 20px; right: 20px"
        :style="{ color: categoryColor(product.category) }"
        :prepend-icon="categoryIcon(product.category)"
      >
        {{ categoryLabel(product.category).replace('Produk ', '') }}
      </v-chip>
    </div>
    <v-card-text class="flex-grow-1 d-flex flex-column pt-1">
      <div class="text-subtitle-1 font-weight-bold text-truncate">{{ product.name }}</div>
      <div v-if="product.species" class="text-caption text-medium-emphasis mb-3 text-truncate flex-grow-1">{{ product.species }}</div>
      <v-btn color="#2554C7" block rounded="pill" @click="open">Lihat Ketelusuran</v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.product-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-2px);
}
</style>
