<script setup>
import TraceabilityFormTangkapan from './TraceabilityFormTangkapan.vue'
import CertificationsEditor from './CertificationsEditor.vue'

defineProps({
  capture: { type: Object, required: true },
  processing: { type: Object, required: true },
})
</script>

<template>
  <div>
    <div class="text-subtitle-1 font-weight-medium mb-3">Data Penangkapan</div>
    <TraceabilityFormTangkapan :model-value="capture" />

    <v-divider class="my-6" />

    <div class="text-subtitle-1 font-weight-medium mb-3">Data Pengolahan</div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="processing.location" label="Lokasi pengolahan" prepend-inner-icon="mdi-factory" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="processing.processingDate" label="Tanggal pengolahan" type="date" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="processing.storageCondition"
          label="Kondisi penyimpanan"
          placeholder="mis. Dibekukan pada suhu -18°C"
          prepend-inner-icon="mdi-snowflake"
        />
      </v-col>
    </v-row>

    <v-divider class="my-6" />
    <CertificationsEditor :model-value="processing.certifications" />
  </div>
</template>
