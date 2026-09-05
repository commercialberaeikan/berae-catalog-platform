import QRCode from 'qrcode'

/** URL publik yang akan dituju oleh QR code: halaman produk, dengan panel
 *  ketelusuran batch tersebut langsung terbuka otomatis. */
export function batchPublicUrl(batchCode, productSlug) {
  if (!productSlug) {
    // fallback lama, hanya dipakai kalau slug produk belum tersedia
    return `${window.location.origin}/batch/${encodeURIComponent(batchCode)}`
  }
  return `${window.location.origin}/produk/${encodeURIComponent(productSlug)}?batch=${encodeURIComponent(batchCode)}`
}

export async function generateBatchQrDataUrl(batchCode, productSlug) {
  return QRCode.toDataURL(batchPublicUrl(batchCode, productSlug), {
    width: 512,
    margin: 2,
    color: { dark: '#04306B', light: '#FFFFFF' },
  })
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
