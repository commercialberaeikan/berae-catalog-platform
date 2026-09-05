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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fitFontSize(ctx, text, maxWidth, startSize, weight) {
  let size = startSize
  ctx.font = `${weight} ${size}px Arial, sans-serif`
  while (ctx.measureText(text).width > maxWidth && size > 14) {
    size -= 2
    ctx.font = `${weight} ${size}px Arial, sans-serif`
  }
  return size
}

/** Render label QR code utuh (logo + nama produk + berat + tanggal + QR) jadi
 *  satu gambar PNG, supaya "Download PNG" menghasilkan label lengkap, bukan
 *  cuma kode QR mentah. */
export async function renderLabelToDataUrl({
  productName,
  packSizeGrams,
  productionDateDisplay,
  expiryDateDisplay,
  qrDataUrl,
  logoSrc = '/logo-berae.png',
}) {
  const width = 640
  const padX = 40
  const padTop = 44
  const padBottom = 44
  const logoH = 88
  const gapAfterLogo = 28
  const nameH = 48
  const gapAfterName = 8
  const weightH = 36
  const gapAfterWeight = 4
  const captionH = 30
  const datesH = 28
  const qrSize = 360
  const borderRadius = 20

  const hasWeight = !!packSizeGrams
  const hasDates = !!(productionDateDisplay || expiryDateDisplay)

  let height = padTop + logoH + gapAfterLogo + nameH + gapAfterName
  if (hasWeight) height += weightH + gapAfterWeight
  height += captionH + (hasDates ? 8 : 28)
  if (hasDates) height += datesH + 28
  height += qrSize + padBottom

  const [logoImg, qrImg] = await Promise.all([loadImage(logoSrc), loadImage(qrDataUrl)])

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  roundRectPath(ctx, 0, 0, width, height, borderRadius)
  ctx.fill()
  ctx.strokeStyle = '#cccccc'
  ctx.lineWidth = 2
  roundRectPath(ctx, 1, 1, width - 2, height - 2, borderRadius)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  let y = padTop
  const logoW = (logoImg.width / logoImg.height) * logoH
  ctx.drawImage(logoImg, (width - logoW) / 2, y, logoW, logoH)
  y += logoH + gapAfterLogo

  const nameText = (productName || '').toUpperCase()
  const fittedSize = fitFontSize(ctx, nameText, width - padX * 2, 40, 800)
  ctx.font = `800 ${fittedSize}px Arial, sans-serif`
  ctx.fillStyle = '#111111'
  ctx.fillText(nameText, width / 2, y + nameH * 0.72)
  y += nameH + gapAfterName

  if (hasWeight) {
    ctx.font = '700 32px Arial, sans-serif'
    ctx.fillStyle = '#111111'
    ctx.fillText(`Berat Bersih: ${packSizeGrams}g`, width / 2, y + weightH * 0.72)
    y += weightH + gapAfterWeight
  }

  ctx.font = '400 26px Arial, sans-serif'
  ctx.fillStyle = '#555555'
  ctx.fillText('Telusuri Produk', width / 2, y + captionH * 0.72)
  y += captionH + (hasDates ? 8 : 28)

  if (hasDates) {
    const parts = []
    if (productionDateDisplay) parts.push(`Produksi: ${productionDateDisplay}`)
    if (expiryDateDisplay) parts.push(`Exp: ${expiryDateDisplay}`)
    ctx.font = '400 24px Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText(parts.join('   |   '), width / 2, y + datesH * 0.72)
    y += datesH + 28
  }

  ctx.drawImage(qrImg, (width - qrSize) / 2, y, qrSize, qrSize)

  return canvas.toDataURL('image/png')
}
