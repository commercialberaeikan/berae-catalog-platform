<script setup>
defineProps({
  certifications: { type: Array, default: () => [] },
})
</script>

<template>
  <div v-if="certifications?.length" class="d-flex flex-wrap ga-2">
    <v-chip
      v-for="(cert, i) in certifications"
      :key="i"
      color="success"
      variant="tonal"
      prepend-icon="mdi-certificate"
      :href="cert.fileUrl || undefined"
      :target="cert.fileUrl ? '_blank' : undefined"
    >
      {{ cert.name }}
      <span v-if="cert.issuer" class="text-caption ml-1">— {{ cert.issuer }}</span>
    </v-chip>
  </div>
</template>
