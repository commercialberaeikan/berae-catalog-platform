<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
onMounted(() => {
  authStore.initAuthListener()
})
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>
