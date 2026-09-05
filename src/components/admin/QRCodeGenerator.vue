<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { generateBatchQrDataUrl, batchPublicUrl, downloadDataUrl } from '@/utils/qrcode'

const props = defineProps({
  batchCode: { type: String, required: true },
  productName: { type: String, default: '' },
  packSizeGrams: { type: Number, default: null },
  productionDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
})

const qrDataUrl = ref(null)

function fmtDateShort(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return value
  }
}

const productionDateDisplay = computed(() => fmtDateShort(props.productionDate))
const expiryDateDisplay = computed(() => fmtDateShort(props.expiryDate))

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
  const weightRow = props.packSizeGrams
    ? `<div style="font-size:16px;font-weight:700;margin-bottom:2px;">Berat Bersih: ${props.packSizeGrams}g</div>`
    : ''
  const datesRow =
    productionDateDisplay.value || expiryDateDisplay.value
      ? `<div style="font-size:12px;color:#333333;margin-bottom:14px;">
          ${productionDateDisplay.value ? `Produksi: ${productionDateDisplay.value}` : ''}
          ${productionDateDisplay.value && expiryDateDisplay.value ? ' &nbsp;|&nbsp; ' : ''}
          ${expiryDateDisplay.value ? `Exp: ${expiryDateDisplay.value}` : ''}
        </div>`
      : ''
  win.document.write(`
    <html>
      <head><title>Label ${props.batchCode}</title></head>
      <body style="font-family: Arial, Helvetica, sans-serif; margin:0; padding:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f2f2f2;">
        <div style="width:320px; border:1px solid #cccccc; border-radius:10px; padding:22px 20px; text-align:center; background:#ffffff;">
          <img src="${window.location.origin}/logo-berae.png" style="height:44px;margin-bottom:14px;" />
          <div style="font-size:20px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px;">${props.productName}</div>
          ${weightRow}
          <div style="font-size:13px;color:#555555;margin-bottom:${datesRow ? '4px' : '14px'};">Telusuri Produk</div>
          ${datesRow}
          <img src="${qrDataUrl.value}" style="width:180px;height:180px;" />
        </div>
        <script>window.onload = () => window.print()<\/script>
      </body>
    </html>
  `)
  win.document.close()
}
</script>

<template>
  <v-card variant="outlined" class="pa-6 text-center">
    <div class="label-preview mx-auto">
      <img src="/logo-berae.png" alt="PT Berae" class="label-logo mb-3" />
      <div class="label-product-name">{{ productName }}</div>
      <div v-if="packSizeGrams" class="label-weight">Berat Bersih: {{ packSizeGrams }}g</div>
      <div class="label-caption" :class="{ 'mb-1': productionDateDisplay || expiryDateDisplay, 'mb-3': !productionDateDisplay && !expiryDateDisplay }">
        Telusuri Produk
      </div>
      <div v-if="productionDateDisplay || expiryDateDisplay" class="label-dates mb-3">
        <span v-if="productionDateDisplay">Produksi: {{ productionDateDisplay }}</span>
        <span v-if="productionDateDisplay && expiryDateDisplay"> &nbsp;|&nbsp; </span>
        <span v-if="expiryDateDisplay">Exp: {{ expiryDateDisplay }}</span>
      </div>
      <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" style="width: 180px; height: 180px; margin: 0 auto" />
    </div>
    <div class="text-caption text-medium-emphasis mt-2 mb-4">{{ batchPublicUrl(batchCode) }}</div>
    <div class="d-flex justify-center ga-2">
      <v-btn color="primary" prepend-icon="mdi-download" @click="download">Download PNG</v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-printer" @click="printLabel">Cetak Label</v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.label-preview {
  max-width: 260px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px 16px;
}
.label-logo {
  height: 40px;
}
.label-product-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.label-weight {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 2px;
}
.label-caption {
  font-size: 12px;
  color: #555555;
}
.label-dates {
  font-size: 11px;
  color: #333333;
}
</style>
