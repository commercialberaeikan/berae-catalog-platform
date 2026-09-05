<script setup>
import { computed } from 'vue'

const props = defineProps({
  nutrition: { type: Object, required: true },
})

function hasValue(v) {
  return v !== null && v !== undefined && v !== ''
}

const nutrients = computed(() => {
  const list = []
  if (hasValue(props.nutrition.calories)) list.push({ label: 'Energi', value: props.nutrition.calories, unit: 'kkal', icon: 'mdi-lightning-bolt' })
  if (hasValue(props.nutrition.protein)) list.push({ label: 'Protein', value: props.nutrition.protein, unit: 'g', icon: 'mdi-arm-flex' })
  if (hasValue(props.nutrition.fat)) list.push({ label: 'Lemak', value: props.nutrition.fat, unit: 'g', icon: 'mdi-water' })
  if (hasValue(props.nutrition.carbs)) list.push({ label: 'Karbohidrat', value: props.nutrition.carbs, unit: 'g', icon: 'mdi-barley' })
  for (const o of props.nutrition.others ?? []) {
    if (hasValue(o.value)) list.push({ label: o.label, value: o.value, unit: o.unit, icon: 'mdi-nutrition' })
  }
  return list
})
</script>

<template>
  <v-card variant="outlined" rounded="xl" class="pa-4 h-100 d-flex flex-column">
    <div class="d-flex align-center mb-1">
      <span class="text-subtitle-1 font-weight-bold">Informasi Nilai Gizi</span>
    </div>
    <div v-if="nutrition.servingSize" class="text-caption text-medium-emphasis mb-4">
      Takaran saji: {{ nutrition.servingSize }}
    </div>

    <div class="nutrients-scroll">
      <v-row dense>
        <v-col v-for="n in nutrients" :key="n.label" cols="4">
          <div class="nutrient-card text-center pa-2">
            <v-icon :icon="n.icon" size="16" color="#2554C7" class="mb-1" />
            <div class="nutrient-value font-weight-bold mb-0">
              {{ n.value }}<span class="nutrient-unit font-weight-regular">{{ n.unit }}</span>
            </div>
            <div class="nutrient-label">{{ n.label }}</div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.nutrient-card {
  background: #eaf0fd;
  border-radius: 14px;
  height: 100%;
}
.nutrient-value {
  font-size: 15px;
  line-height: 1.2;
  white-space: nowrap;
  color: #12358a;
}
.nutrient-unit {
  font-size: 10px;
  color: #12358a;
}
.nutrient-label {
  font-size: 10px;
  line-height: 1.2;
  word-break: keep-all;
  overflow-wrap: normal;
  hyphens: none;
  color: #2554c7;
}
.nutrients-scroll {
  max-height: 216px;
  overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
}
</style>
