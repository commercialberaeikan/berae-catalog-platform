<script setup>
const props = defineProps({
  modelValue: { type: Array, required: true },
})

function addCert() {
  props.modelValue.push({ name: '', issuer: '', validUntil: '', fileUrl: '' })
}

function removeCert(index) {
  props.modelValue.splice(index, 1)
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="text-subtitle-2">Sertifikasi</div>
      <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addCert">Tambah Sertifikat</v-btn>
    </div>
    <v-card v-for="(cert, i) in modelValue" :key="i" variant="outlined" class="mb-2 pa-3">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field v-model="cert.name" label="Nama sertifikat" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="cert.issuer" label="Penerbit" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="cert.validUntil" label="Berlaku s/d" type="date" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="2" class="d-flex align-center">
          <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="removeCert(i)" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="cert.fileUrl" label="URL dokumen sertifikat (opsional)" density="compact" hide-details />
        </v-col>
      </v-row>
    </v-card>
    <div v-if="!modelValue.length" class="text-caption text-medium-emphasis">Belum ada sertifikat ditambahkan.</div>
  </div>
</template>
