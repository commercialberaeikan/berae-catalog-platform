<script setup>
import { PRODUCT_CATEGORIES } from '@/utils/constants'
</script>

<template>
  <div class="hero-banner py-14 py-md-20 text-center">
    <v-container>
      <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-3">Tentang Kami</h1>
      <p class="text-body-1 text-white opacity-80 mb-0 mx-auto" style="max-width: 560px">
        PT Berae Segara Nusantara — menghadirkan produk perikanan Nusantara yang tertelusuri, dari laut dan kolam hingga ke meja Anda.
      </p>
    </v-container>
  </div>

  <v-container class="py-10 py-md-14" style="max-width: 900px">
    <v-row>
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold mb-3">Siapa Kami</h2>
        <p class="text-body-1 text-medium-emphasis">
          PT Berae Segara Nusantara adalah perusahaan yang bergerak di bidang perikanan — mulai dari hasil tangkapan
          nelayan, produk olahan, hingga hasil budidaya. Kami percaya bahwa customer berhak tahu asal-usul produk yang
          mereka konsumsi, karena itu setiap produk kami dilengkapi jejak ketelusuran yang bisa dicek langsung lewat
          QR code di kemasan.
        </p>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold mb-3">Komitmen Kami</h2>
        <p class="text-body-1 text-medium-emphasis">
          Kami berkomitmen menjaga kualitas dan kesegaran produk melalui penanganan rantai dingin yang tepat,
          pengolahan yang higienis, serta praktik budidaya yang bertanggung jawab — didukung sertifikasi resmi dari
          instansi terkait untuk setiap tahap prosesnya.
        </p>
      </v-col>
    </v-row>

    <v-divider class="my-10" />

    <h2 class="text-h6 font-weight-bold mb-6 text-center">Kategori Produk Kami</h2>
    <v-row>
      <v-col v-for="c in PRODUCT_CATEGORIES" :key="c.value" cols="12" md="4">
        <v-card variant="outlined" class="pa-6 h-100 text-center">
          <v-avatar :color="c.color" variant="tonal" size="56" class="mb-4">
            <v-icon :icon="c.icon" size="28" :color="c.color" />
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold mb-2">{{ c.title }}</div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            <span v-if="c.value === 'tangkapan'">Ikan segar hasil tangkapan nelayan lokal, ditangani dengan rantai dingin sejak di atas kapal.</span>
            <span v-else-if="c.value === 'olahan'">Produk olahan higienis dari bahan baku pilihan, diproses dan dikemas untuk menjaga kesegaran.</span>
            <span v-else>Hasil budidaya kolam dengan pakan terkontrol dan praktik budidaya yang bertanggung jawab.</span>
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-10" />

    <v-alert type="info" variant="tonal" rounded="xl">
      Ingin tahu asal produk yang Anda beli? Scan QR code di kemasan, atau
      <router-link :to="{ name: 'catalog-home' }" class="font-weight-bold">jelajahi katalog produk kami</router-link>.
    </v-alert>
  </v-container>
</template>
