<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <v-container class="py-16 text-center">
    <v-icon icon="mdi-fish-off" size="64" color="primary" class="mb-4" />
    <h1 class="text-h5 mb-2">Halaman tidak ditemukan</h1>
    <v-btn color="primary" @click="router.push({ name: 'catalog-home' })">Kembali ke Katalog</v-btn>
  </v-container>
</template>
