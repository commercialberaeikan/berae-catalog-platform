<script setup>
import { ref } from 'vue'
import { compressImageToDataUrl, totalDataUrlBytes, MAX_TOTAL_IMAGE_BYTES } from '@/utils/image'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: 'Foto' },
})
const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const error = ref(null)

async function handleFiles(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return
  uploading.value = true
  error.value = null
  try {
    const compressed = await Promise.all(files.map((file) => compressImageToDataUrl(file)))
    const combined = [...props.modelValue, ...compressed]
    if (totalDataUrlBytes(combined) > MAX_TOTAL_IMAGE_BYTES) {
      error.value = 'Total ukuran foto terlalu besar untuk disimpan. Hapus foto lain dulu atau pilih foto yang lebih sederhana.'
      return
    }
    emit('update:modelValue', combined)
  } catch (err) {
    error.value = 'Gagal memproses foto: ' + err.message
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

function removeImage(dataUrl) {
  emit('update:modelValue', props.modelValue.filter((u) => u !== dataUrl))
}
</script>

<template>
  <div>
    <div class="text-subtitle-2 mb-2">{{ label }}</div>
    <div class="d-flex flex-wrap ga-3 mb-3">
      <v-card v-for="url in modelValue" :key="url" width="120" height="120" class="position-relative">
        <v-img :src="url" height="120" cover />
        <v-btn
          icon="mdi-close"
          size="x-small"
          color="error"
          class="position-absolute"
          style="top: 4px; right: 4px"
          @click="removeImage(url)"
        />
      </v-card>
    </div>
    <v-btn
      variant="tonal"
      color="primary"
      prepend-icon="mdi-upload"
      :loading="uploading"
      @click="$refs.fileInput.click()"
    >
      Upload Foto
    </v-btn>
    <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFiles" />
    <v-alert v-if="error" type="error" variant="tonal" class="mt-2" density="compact">{{ error }}</v-alert>
  </div>
</template>
