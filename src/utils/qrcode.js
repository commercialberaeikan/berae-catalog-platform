import QRCode from 'qrcode'

/** URL publik halaman ketelusuran batch yang akan dituju oleh QR code */
export function batchPublicUrl(batchCode) {
  return `${window.location.origin}/batch/${encodeURIComponent(batchCode)}`
}

export async function generateBatchQrDataUrl(batchCode) {
  return QRCode.toDataURL(batchPublicUrl(batchCode), {
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
