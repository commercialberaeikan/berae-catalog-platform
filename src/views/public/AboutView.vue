<script setup>
const QUALITY_ASSURANCE = [
  {
    title: 'Kesegaran',
    icon: 'mdi-snowflake',
    color: '#2554C7',
    description: 'Jaminan rantai dingin (Cold Chain) yang terjaga dari penangkapan/budidaya, hingga tempat pengolahan dan pengiriman.',
  },
  {
    title: 'Keamanan',
    icon: 'mdi-shield-check',
    color: '#2554C7',
    description: 'Bebas dari bahan pengawet berbahaya (Formalin, Boraks, dll). Serta, dilengkapi dengan hasil uji laboratorium berkala (COA).',
  },
  {
    title: 'Konsisten',
    icon: 'mdi-truck-fast',
    color: '#2554C7',
    description: 'Komitmen untuk konsisten dalam memenuhi volume suplai harian/mingguan sesuai kebutuhan customer tanpa kendala.',
  },
  {
    title: 'Standarisasi',
    icon: 'mdi-certificate-outline',
    color: '#2554C7',
    description: 'Menekankan pada kepatuhan terhadap standar kebersihan, keamanan pangan, HACCP, Halal, SKP, CBIB & CPIB, serta proses Cold Chain Management yang ketat.',
  },
]
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

  <div class="bg-white">
  <v-container class="pt-10 pt-md-14 pb-4">
    <h2 class="text-h6 font-weight-bold mb-2 text-center">Alur Rantai Pasok Kami</h2>
    <p class="text-body-2 text-medium-emphasis text-center mb-6 mx-auto" style="max-width: 640px">
      Dari nelayan &amp; pembudidaya, melalui proses penanganan dan rantai dingin Berae, hingga sampai ke meja
      pelanggan — setiap tahap tercatat dan tertelusuri.
    </p>
    <div class="supply-chain-scroll">
      <v-img src="/supply-chain.jpg" rounded="xl" class="bg-surface-variant supply-chain-img" />
    </div>
  </v-container>

  <v-container class="pt-4 pb-4" style="max-width: 900px">
    <h2 class="text-h6 font-weight-bold mb-3 text-center">Profil Kami</h2>
    <p class="text-body-1 text-medium-emphasis text-center mx-auto" style="max-width: 720px">
      PT Berae Segara Nusantara, berdiri di atas filosofi "Berae" (mengumpulkan), berkomitmen menjadi jembatan antara
      hasil tangkapan laut terbaik nelayan ke tangan konsumen. Memastikan setiap produk perikanan memenuhi standar
      mutu yang baik melalui penanganan ikan yang tepat, karena kami yakin bahwa makan
      <strong>#BukanHanyaSoalKenyang</strong>, tetapi juga bergizi. Karena dengan penanganan ikan yang baik akan
      membuat gizi ikan tetap terjaga dan optimal.
    </p>
  </v-container>

  <v-container class="pt-4 pb-4">
    <h2 class="text-h6 font-weight-bold mb-2 text-center">Jaminan Kualitas</h2>
    <p class="text-body-2 text-medium-emphasis text-center mb-8 mx-auto" style="max-width: 640px">
      Empat pilar yang kami jaga di setiap tahap, dari laut/kolam hingga ke tangan Anda.
    </p>
    <v-row>
      <v-col v-for="q in QUALITY_ASSURANCE" :key="q.title" cols="12" sm="6" md="3">
        <v-card variant="outlined" rounded="xl" class="quality-card pa-6 h-100 text-center" :style="{ borderTopColor: q.color }">
          <v-avatar :color="q.color" variant="tonal" size="64" class="mb-4">
            <v-icon :icon="q.icon" size="32" :color="q.color" />
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold mb-2">{{ q.title }}</div>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ q.description }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="pt-4 pb-4">
    <h2 class="text-h6 font-weight-bold mb-2 text-center">Sertifikasi Kami</h2>
    <p class="text-body-2 text-medium-emphasis text-center mb-8 mx-auto" style="max-width: 640px">
      Setiap produk kami didukung sertifikasi resmi yang menjamin standar mutu, keamanan, dan kehalalan.
    </p>
    <div class="cert-logos-row">
      <img src="/cert-halal-indonesia.png" alt="Sertifikasi Halal Indonesia" class="cert-logo" />
      <img src="/cert-haccp.png" alt="Sertifikasi HACCP" class="cert-logo" />
      <img src="/cert-skp.png" alt="Sertifikasi SKP" class="cert-logo" />
      <img src="/cert-cbib.png" alt="Sertifikasi CBIB - Cara Budidaya Ikan Yang Baik" class="cert-logo" />
      <img src="/cert-cpib.png" alt="Sertifikasi CPIB - Cara Pembenihan Ikan Yang Baik" class="cert-logo" />
    </div>
  </v-container>

  <v-container class="pt-4 pb-10 pb-md-14" style="max-width: 900px">
    <v-alert type="info" variant="tonal" rounded="xl">
      Ingin tahu asal produk yang Anda beli? Scan QR code di kemasan, atau
      <router-link :to="{ name: 'catalog-home' }" class="font-weight-bold">jelajahi katalog produk kami</router-link>.
    </v-alert>
  </v-container>
  </div>
</template>

<style scoped>
.supply-chain-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.supply-chain-img {
  min-width: 900px;
  width: 100%;
}
@media (min-width: 960px) {
  .supply-chain-img {
    min-width: 0;
  }
}
.quality-card {
  border-top-width: 4px !important;
  border-top-style: solid !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.quality-card:hover {
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-3px);
}
.cert-logos-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 32px 40px;
}
.cert-logo {
  height: 80px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
}
</style>
