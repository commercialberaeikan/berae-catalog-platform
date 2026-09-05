// Seed data contoh (2 produk: Nila Fillet & Lele Headless) ke Firebase Local
// Emulator Suite, supaya katalog & halaman ketelusuran bisa langsung dites
// end-to-end tanpa input manual dulu.
//
// Jalankan lewat: npm run emulators (di terminal lain), lalu: npm run seed
//
// PENTING: project ID di sini HARUS sama dengan VITE_FIREBASE_PROJECT_ID di .env
// (dibaca otomatis lewat `node --env-file=.env`, lihat script "seed" di package.json),
// karena Firestore Emulator memisahkan data per project ID — kalau beda, app di
// browser tidak akan melihat data yang di-seed di sini sama sekali.
//
// CATATAN: data di sini hanya untuk Firebase Emulator (testing lokal) dan akan
// selalu reset setiap emulator restart tanpa --import. Untuk data permanen di
// situs production, input lewat panel admin (/admin/produk/baru).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const __dirname = dirname(fileURLToPath(import.meta.url))

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099'

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'demo-berae-catalog'
console.log(`Seeding project: ${projectId}`)

const app = initializeApp({ projectId })
const db = getFirestore(app)
const auth = getAuth(app)

function imageDataUrl(filename) {
  const bytes = readFileSync(join(__dirname, 'assets', filename))
  return `data:image/jpeg;base64,${bytes.toString('base64')}`
}

async function ensureAdminUser() {
  const email = 'admin@berae.test'
  const password = 'berae123456'
  try {
    await auth.getUserByEmail(email)
    console.log(`Admin user sudah ada: ${email}`)
  } catch {
    await auth.createUser({ email, password, emailVerified: true })
    console.log(`Admin user dibuat -> email: ${email} / password: ${password}`)
  }
}

async function seedProducts() {
  const products = [
    {
      id: 'nila-fillet',
      name: 'Nila Fillet',
      slug: 'nila-fillet',
      category: 'olahan',
      species: 'Oreochromis niloticus (Nila)',
      description: 'Fillet nila tanpa duri, diproses higienis dari nila budidaya kolam mitra dan dibekukan cepat.',
      images: [imageDataUrl('nila-fillet.jpg')],
      status: 'active',
      nutritionFacts: {
        servingSize: '100 gram',
        calories: 118,
        protein: 24,
        fat: 1.5,
        carbs: 0,
        others: [],
      },
      batch: {
        batchCode: 'BRE-OLH-0001',
        capture: {
          location: 'Tambak Budidaya Mitra, Bone, Sulawesi Selatan',
          catchDate: '2026-08-18',
          fishingMethod: 'Panen dari kolam budidaya mitra',
          handling: 'Langsung didinginkan dengan es curah setelah panen',
        },
        processing: {
          location: 'Unit Pengolahan Ikan, Makassar',
          processingDate: '2026-08-19',
          storageCondition: 'Dibekukan pada suhu -18°C (blast freezer)',
          certifications: [
            { name: 'HACCP', issuer: 'Kementerian Kelautan dan Perikanan', validUntil: '2027-01-01', fileUrl: '' },
          ],
        },
      },
    },
    {
      id: 'lele-headless',
      name: 'Lele Headless',
      slug: 'lele-headless',
      category: 'budidaya',
      species: 'Clarias sp. (Lele)',
      description: 'Lele budidaya tanpa kepala (headless), siap olah, dari kolam budidaya dengan pakan terkontrol.',
      images: [],
      status: 'active',
      nutritionFacts: {
        servingSize: '100 gram',
        calories: 105,
        protein: 22,
        fat: 2,
        carbs: 0,
        others: [],
      },
      batch: {
        batchCode: 'BRE-BDY-0001',
        aquaculture: {
          broodstockOrigin: 'Balai Benih Ikan Sentral, Bogor',
          spawningDate: '2026-05-02',
          farmLocation: 'Kolam Budidaya Berae, Sukabumi, Jawa Barat',
          harvestDate: '2026-08-10',
          feed: 'Pelet apung protein 30%',
          postHarvestHandling: 'Dipotong kepala (headless), dicuci bersih, langsung didinginkan',
          certifications: [
            { name: 'CBIB (Cara Budidaya Ikan yang Baik)', issuer: 'Kementerian Kelautan dan Perikanan', validUntil: '2027-05-01', fileUrl: '' },
          ],
        },
      },
    },
  ]

  for (const p of products) {
    const { batch, ...productData } = p
    await db.collection('products').doc(p.id).set({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
    })

    await db.collection('batches').doc(`${p.id}-batch-1`).set({
      productId: p.id,
      productSnapshot: { name: p.name, category: p.category, slug: p.slug },
      status: 'active',
      photos: [],
      batchCode: batch.batchCode,
      ...(batch.capture ? { capture: batch.capture } : {}),
      ...(batch.processing ? { processing: batch.processing } : {}),
      ...(batch.aquaculture ? { aquaculture: batch.aquaculture } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
    })

    console.log(`Seed produk: ${p.name} (batch ${batch.batchCode})`)
  }
}

await ensureAdminUser()
await seedProducts()
console.log('\nSelesai. Buka http://127.0.0.1:5050 (katalog publik) via Emulator Hosting, atau jalankan npm run dev terpisah.')
process.exit(0)
