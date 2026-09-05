<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const theme = useTheme()

onMounted(() => {
  theme.change('beraeAdminLight')
})

const email = ref('')
const password = ref('')

function goToRedirect() {
  router.push(route.query.redirect?.toString() ?? { name: 'admin-dashboard' })
}

async function handleSubmit() {
  const ok = await authStore.login(email.value, password.value)
  if (ok) goToRedirect()
}

async function handleGoogleLogin() {
  const ok = await authStore.loginWithGoogle()
  if (ok) goToRedirect()
}
</script>

<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center" style="max-width: 420px">
    <v-card class="w-100 pa-4" elevation="2">
      <v-card-item>
        <div class="d-flex flex-column align-center mb-4">
          <img src="/logo-berae.png" alt="PT Berae Segara Nusantara" height="48" class="mb-2" />
        </div>
      </v-card-item>
      <v-card-text>
        <v-btn
          variant="outlined"
          block
          size="large"
          prepend-icon="mdi-google"
          class="mb-4"
          :loading="authStore.loading"
          @click="handleGoogleLogin"
        >
          Masuk dengan Google
        </v-btn>

        <div class="d-flex align-center ga-3 mb-4">
          <v-divider />
          <span class="text-caption text-medium-emphasis">atau</span>
          <v-divider />
        </div>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email"
            class="mb-2"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            required
          />
          <v-alert v-if="authStore.error" type="error" variant="tonal" density="compact" class="mb-4 mt-4">
            {{ authStore.error }}
          </v-alert>
          <v-btn type="submit" color="primary" block size="large" class="mt-4" :loading="authStore.loading">Masuk</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mt-4" :to="{ name: 'catalog-home' }">
      Kembali ke Katalog
    </v-btn>
  </v-container>
</template>
