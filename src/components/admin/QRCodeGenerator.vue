<script setup>
import { onMounted, ref, watch } from 'vue'
import { generateBatchQrDataUrl, batchPublicUrl, downloadDataUrl } from '@/utils/qrcode'

const props = defineProps({
  batchCode: { type: String, required: true },
  productName: { type: String, default: '' },
})

const qrDataUrl = ref(null)

async function generate() {
  qrDataUrl.value = await generateBatchQrDataUrl(props.batchCode)
}

onMounted(generate)
watch(() => props.batchCode, generate)

function download() {
  downloadDataUrl(qrDataUrl.value, `qr-${props.batchCode}.png`)
}

function printLabel() {
  const win = window.open('', '_blank')
  win.document.write(`
    <html>
      <head><title>Label ${props.batchCode}</title></head>
      <body style="font-family: sans-serif; text-align:center; padding:24px;">
        <img src="${qrDataUrl.value}" style="width:240px;height:240px;" />
        <div style="font-weight:bold;margin-top:8px;">${props.productName}</div>
        <div style="font-size:14px;">${props.batchCode}</div>
        <script>window.onload = () => window.print()<\/script>
      </body>
    </html>
  `)
  win.document.close()
}
</script>

<template>
  <v-card variant="outlined" class="pa-6 text-center">
    <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" style="width: 220px; height: 220px; margin: 0 auto" />
    <div class="text-caption text-medium-emphasis mt-2 mb-4">{{ batchPublicUrl(batchCode) }}</div>
    <div class="d-flex justify-center ga-2">
      <v-btn color="primary" prepend-icon="mdi-download" @click="download">Download PNG</v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-printer" @click="printLabel">Cetak Label</v-btn>
    </div>
  </v-card>
</template>
