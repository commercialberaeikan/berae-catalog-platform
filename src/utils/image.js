/**
 * Kompresi foto jadi data URI base64 supaya bisa disimpan langsung di field
 * dokumen Firestore (proyek ini tidak memakai Firebase Storage). Diresize ke
 * dimensi maksimum & dikompres JPEG supaya tidak membengkakkan ukuran dokumen
 * (limit Firestore: 1 MiB per dokumen).
 */
export function compressImageToDataUrl(file, { maxDim = 1024, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('File bukan gambar yang valid'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/** Batas aman total ukuran array foto (base64) per dokumen, sisakan ruang untuk field lain. */
export const MAX_TOTAL_IMAGE_BYTES = 700_000

export function totalDataUrlBytes(dataUrls) {
  return dataUrls.reduce((sum, d) => sum + d.length, 0)
}
