<script setup>
import CertificationsEditor from './CertificationsEditor.vue'

defineProps({
  modelValue: { type: Object, required: true },
})
</script>

<template>
  <div>
    <div class="text-subtitle-1 font-weight-medium mb-3">Pembenihan</div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.broodstockOrigin" label="Asal induk" prepend-inner-icon="mdi-egg-outline" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.spawningDate" label="Tanggal pemijahan" type="date" />
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <div class="text-subtitle-1 font-weight-medium mb-3">Budidaya</div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.farmLocation" label="Lokasi budidaya" prepend-inner-icon="mdi-map-marker" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.feed" label="Jenis pakan" prepend-inner-icon="mdi-grain" />
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <div class="text-subtitle-1 font-weight-medium mb-3">Panen & Penanganan</div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.harvestDate" label="Tanggal panen" type="date" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="modelValue.postHarvestHandling" label="Penanganan pasca panen" />
      </v-col>
    </v-row>

    <v-divider class="my-6" />
    <CertificationsEditor :model-value="modelValue.certifications" />
  </div>
</template>
