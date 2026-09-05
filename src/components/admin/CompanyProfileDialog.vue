<script setup>
import { reactive, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const modelValue = defineModel({ type: Boolean, default: false })
const settingsStore = useSettingsStore()

const form = reactive({
  name: '',
  address: '',
  email: '',
  phone: '',
})
const loading = ref(false)
const saving = ref(false)
const saved = ref(false)
const error = ref(null)

watch(modelValue, async (open) => {
  if (!open) return
  saved.value = false
  error.value = null
  loading.value = true
  try {
    await settingsStore.fetchCompany()
    Object.assign(form, {
      name: '',
      address: '',
      email: '',
      phone: '',
      ...settingsStore.company,
    })
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  saving.value = true
  error.value = null
  try {
    await settingsStore.saveCompany({ ...form })
    saved.value = true
  } catch (err) {
    error.value = 'Gagal menyimpan profil perusahaan: ' + err.message
  } finally {
    saving.value = false
  }
}

function close() {
  modelValue.value = false
}
</script>

<template>
  <v-dialog v-model="modelValue" max-width="480">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        Profil Perusahaan
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-card-text v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </v-card-text>

      <v-card-text v-else>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="form.name" label="Nama Perusahaan" prepend-inner-icon="mdi-domain" class="mb-2" />
          <v-textarea v-model="form.address" label="Alamat" rows="2" prepend-inner-icon="mdi-map-marker-outline" class="mb-2" />
          <v-text-field v-model="form.email" label="Email" type="email" prepend-inner-icon="mdi-email-outline" class="mb-2" />
          <v-text-field v-model="form.phone" label="Nomor Telepon" prepend-inner-icon="mdi-phone-outline" />
          <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mt-2">Profil perusahaan tersimpan.</v-alert>
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2">{{ error }}</v-alert>
          <v-btn type="submit" color="primary" block size="large" class="mt-4" :loading="saving">Simpan</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
