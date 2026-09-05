<script setup>
import TraceabilityFormTangkapan from './TraceabilityFormTangkapan.vue'
import TraceabilityFormBudidaya from './TraceabilityFormBudidaya.vue'
import CertificationsEditor from './CertificationsEditor.vue'

defineProps({
  sourceType: { type: String, required: true },
  capture: { type: Object, required: true },
  aquaculture: { type: Object, required: true },
  processing: { type: Object, required: true },
})

defineEmits(['update:sourceType'])
</script>

<template>
  <div>
    <div class="text-subtitle-1 font-weight-medium mb-3">Sumber Bahan Baku</div>
    <v-btn-toggle
      :model-value="sourceType"
      color="primary"
      variant="outlined"
      density="comfortable"
      mandatory
      divided
      class="mb-6"
      @update:model-value="(val) => $emit('update:sourceType', val)"
    >
      <v-btn value="tangkapan" prepend-icon="mdi-sail-boat">Hasil Tangkapan</v-btn>
      <v-btn value="budidaya" prepend-icon="mdi-fishbowl">Hasil Budidaya</v-btn>
    </v-btn-toggle>

    <template v-if="sourceType === 'budidaya'">
      <TraceabilityFormBudidaya :model-value="aquaculture" />
    </template>
    <template v-else>
      <div class="text-subtitle-1 font-weight-medium mb-3">Data Penangkapan</div>
      <TraceabilityFormTangkapan :model-value="capture" />
    </template>

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
