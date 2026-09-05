<script setup>
defineProps({
  modelValue: { type: Object, required: true },
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field v-model="modelValue.location" label="Lokasi penangkapan" prepend-inner-icon="mdi-map-marker" />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="modelValue.catchDate" label="Tanggal penangkapan" type="date" />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="modelValue.fishingMethod" label="Cara/alat penangkapan" placeholder="mis. Pancing ulur, jaring insang" />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="modelValue.handling" label="Penanganan awal" placeholder="mis. Pendinginan es curah di atas kapal" />
    </v-col>
  </v-row>
</template>
