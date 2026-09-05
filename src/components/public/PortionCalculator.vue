<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  glazzingPercent: { type: Number, default: 0 },
  packSizeGrams: { type: Number, default: null },
})

const gramPerPortion = ref(null)
const totalPortions = ref(null)

const hasInput = computed(() => !!gramPerPortion.value && !!totalPortions.value)

const requiredRawGrams = computed(() => {
  if (!hasInput.value) return 0
  const desiredNetGrams = gramPerPortion.value * totalPortions.value
  const glazzing = props.glazzingPercent ?? 0
  return desiredNetGrams / (1 - glazzing / 100)
})

const requiredKgDisplay = computed(() => (requiredRawGrams.value / 1000).toFixed(2))
const requiredPcs = computed(() => (props.packSizeGrams ? Math.ceil(requiredRawGrams.value / props.packSizeGrams) : null))
</script>

<template>
  <v-card variant="outlined" rounded="xl" class="pa-4 h-100 d-flex flex-column">
    <div class="d-flex align-center mb-1">
      <span class="text-subtitle-1 font-weight-bold">Kalkulator Porsi</span>
    </div>
    <div class="text-caption text-medium-emphasis mb-4">Hitung estimasi kebutuhan bahan baku</div>

    <v-row dense>
      <v-col cols="6">
        <div class="text-caption text-medium-emphasis mb-1">Gramasi</div>
        <v-text-field
          v-model.number="gramPerPortion"
          placeholder="150"
          suffix="g"
          type="number"
          density="compact"
          hide-details
          class="calc-field"
        />
      </v-col>
      <v-col cols="6">
        <div class="text-caption text-medium-emphasis mb-1">Porsi</div>
        <v-text-field
          v-model.number="totalPortions"
          placeholder="10"
          suffix="Porsi"
          type="number"
          density="compact"
          hide-details
          class="calc-field"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <div v-if="hasInput" class="flex-grow-1 d-flex flex-column justify-center text-center">
      <div class="text-caption text-medium-emphasis mb-1">Estimasi bahan baku dibutuhkan</div>
      <div class="text-h5 font-weight-bold" style="color: #2554c7">{{ requiredKgDisplay }} kg</div>
      <div v-if="requiredPcs" class="text-caption text-medium-emphasis mt-1">
        ≈ {{ requiredPcs }} pcs kemasan ({{ packSizeGrams }} g/pcs)
      </div>
      <div v-if="glazzingPercent" class="text-caption text-medium-emphasis mt-2">
        *sudah memperhitungkan glazzing {{ glazzingPercent }}%
      </div>
    </div>
    <div v-else class="flex-grow-1 d-flex align-center justify-center text-medium-emphasis text-caption text-center px-4">
      Isi gramasi & jumlah porsi untuk melihat estimasi kebutuhan bahan baku
    </div>
  </v-card>
</template>

<style scoped>
.calc-field :deep(.v-text-field__suffix) {
  opacity: 1 !important;
}
.calc-field :deep(input[type='number']::-webkit-inner-spin-button),
.calc-field :deep(input[type='number']::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
.calc-field :deep(input[type='number']) {
  -moz-appearance: textfield;
}
</style>
