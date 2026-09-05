<script setup>
defineProps({
  nutrition: { type: Object, required: true },
})
</script>

<template>
  <v-card variant="outlined" rounded="xl">
    <v-card-item>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-food-apple" color="primary" class="mr-2" />
        Informasi Nilai Gizi
      </v-card-title>
      <v-card-subtitle v-if="nutrition.servingSize">Takaran saji: {{ nutrition.servingSize }}</v-card-subtitle>
    </v-card-item>
    <v-divider />
    <v-table density="comfortable">
      <tbody>
        <tr v-if="nutrition.calories != null">
          <td class="font-weight-medium">Energi</td>
          <td class="text-right">{{ nutrition.calories }} kkal</td>
        </tr>
        <tr v-if="nutrition.protein != null">
          <td>Protein</td>
          <td class="text-right">{{ nutrition.protein }} g</td>
        </tr>
        <tr v-if="nutrition.fat != null">
          <td>Lemak</td>
          <td class="text-right">{{ nutrition.fat }} g</td>
        </tr>
        <tr v-if="nutrition.carbs != null">
          <td>Karbohidrat</td>
          <td class="text-right">{{ nutrition.carbs }} g</td>
        </tr>
        <tr v-for="(o, i) in nutrition.others" :key="i">
          <td>{{ o.label }}</td>
          <td class="text-right">{{ o.value }} {{ o.unit }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
