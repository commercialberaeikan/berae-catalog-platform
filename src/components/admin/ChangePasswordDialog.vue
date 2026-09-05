<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const modelValue = defineModel({ type: Boolean, default: false })
const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref(null)
const success = ref(false)
const saving = ref(false)

function reset() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = null
  success.value = false
}

function close() {
  modelValue.value = false
  reset()
}

async function handleSubmit() {
  error.value = null
  if (newPassword.value.length < 6) {
    error.value = 'Password baru minimal 6 karakter.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Konfirmasi password baru tidak cocok.'
    return
  }
  saving.value = true
  try {
    await authStore.changePassword(currentPassword.value, newPassword.value)
    success.value = true
  } catch (err) {
    error.value = mapError(err.code)
  } finally {
    saving.value = false
  }
}

function mapError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Password saat ini salah.'
    case 'auth/weak-password':
      return 'Password baru terlalu lemah, gunakan minimal 6 karakter.'
    default:
      return 'Gagal mengubah password. Silakan coba lagi.'
  }
}
</script>

<template>
  <v-dialog v-model="modelValue" max-width="440" @update:model-value="!$event && reset()">
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between">
        Ubah Kata Sandi
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-card-text v-if="success">
        <v-alert type="success" variant="tonal">Password berhasil diubah.</v-alert>
      </v-card-text>

      <v-card-text v-else>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="currentPassword"
            label="Password saat ini"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            class="mb-2"
            autocomplete="current-password"
            required
          />
          <v-text-field
            v-model="newPassword"
            label="Password baru"
            type="password"
            prepend-inner-icon="mdi-key-outline"
            class="mb-2"
            autocomplete="new-password"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            label="Konfirmasi password baru"
            type="password"
            prepend-inner-icon="mdi-key-outline"
            autocomplete="new-password"
            required
          />
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2">{{ error }}</v-alert>
          <v-btn type="submit" color="primary" block size="large" class="mt-4" :loading="saving">
            Simpan Password Baru
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions v-if="success">
        <v-spacer />
        <v-btn color="primary" @click="close">Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
