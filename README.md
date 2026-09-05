# Berae Katalog Produk

Platform katalog & ketelusuran produk perikanan PT Berae Segara Nusantara.

- **Modul Catalog** (publik): beranda produk (browse/search/filter), halaman detail produk, dan halaman ketelusuran per batch (`/batch/:batchCode`) — inilah halaman tujuan saat customer men-scan QR code di kemasan produk.
- **Modul Master Data** (`/admin`, perlu login): kelola Katalog Produk dan Batch Produksi, generate QR code per batch untuk dicetak dan ditempel ke produk. Ada juga menu **"Lihat sebagai Customer"** — preview langsung tampilan katalog publik (desktop/tablet/mobile) dari dalam admin panel, tanpa perlu buka tab baru.

Stack: Vue 3 + Vuetify 3 (Material 3 blueprint, tema hitam-putih) + Firebase (Firestore, Authentication) untuk data, di-hosting via **Netlify** (auto-deploy dari GitHub).

## Development lokal — TIDAK perlu deploy dulu

`npm run dev` langsung terhubung ke Firestore/Authentication **project asli** (`catalogberae`) — bukan cuma tampilan statis. Artinya setiap penyesuaian di admin panel (CRUD produk/batch, desain, dsb) bisa langsung dicek di `http://localhost:5173/admin` dengan data sungguhan, **tanpa perlu `npm run deploy`**. Deploy hanya diperlukan saat ingin mempublikasikan perubahan ke URL production (`https://catalogberae.web.app`) yang diakses customer via QR code.

```bash
npm install
npm run dev   # buka http://localhost:5173 — publik & /admin, langsung pakai data project asli
```

Login admin: **berae@admin.id** (password yang sudah Anda buat di Firebase Console).

Kalau tidak ingin uji coba menyentuh data asli sama sekali (mis. sedang bereksperimen), pakai Firebase Emulator sebagai gantinya — lihat bagian di bawah.

**Catatan foto**: proyek ini sengaja **tidak memakai Firebase Storage** (atas permintaan — supaya tidak perlu upgrade ke plan Blaze). Foto produk/batch dikompres di browser lalu disimpan langsung sebagai data base64 di dalam dokumen Firestore (lihat `src/utils/image.js`). Konsekuensinya: total ukuran foto per produk/batch dibatasi ~700KB (batas dokumen Firestore adalah 1 MiB) — cukup untuk beberapa foto berkualitas web, tapi bukan untuk foto resolusi tinggi dalam jumlah banyak.

## Alternatif: development pakai Firebase Emulator (data terpisah dari project asli)

```bash
npm install
npm run emulators   # jalankan di satu terminal (Firestore, Auth emulator)
npm run seed         # di terminal lain: isi data contoh (3 produk + 3 batch) & 1 admin user
npm run dev          # di terminal lain: jalankan app di http://localhost:5173
```

Ubah dulu `VITE_USE_FIREBASE_EMULATOR=true` di `.env` (default-nya `false`, langsung connect ke project asli seperti dijelaskan di atas). Akun admin contoh setelah `npm run seed`: **admin@berae.test / berae123456** — login di `/admin/login`.

`npm run seed` otomatis membaca `VITE_FIREBASE_PROJECT_ID` dari `.env` (lewat `node --env-file=.env`), jadi data seed selalu masuk ke namespace emulator yang sama dengan yang dipakai app — tidak perlu diubah manual. Data emulator disimpan di folder `.emulator-data` (tidak di-commit) dan otomatis di-load lagi tiap `npm run emulators` dijalankan.

Firebase Emulator UI (lihat isi Firestore/Auth secara visual): http://127.0.0.1:4000 (port default emulator UI).

## Publikasikan ke production (GitHub → Netlify)

Alur deploy sekarang: **push ke GitHub → Netlify otomatis build & deploy.** Tidak ada lagi `firebase deploy --only hosting` manual.

```bash
git add .
git commit -m "pesan perubahan"
git push
```

Begitu ter-push ke branch yang dihubungkan ke Netlify (biasanya `main`), Netlify otomatis menjalankan `npm run build` (lihat `netlify.toml`) dan mempublikasikan folder `dist/`. Cek progress build di dashboard Netlify.

Firestore rules & indexes **tidak** ikut ter-deploy oleh Netlify (itu di luar cakupan hosting) — kalau ada perubahan di `firestore.rules`/`firestore.indexes.json`, deploy manual terpisah:
```bash
npm run deploy:rules   # firebase deploy --only firestore
```

Project Firebase **catalogberae** (`commercial.beraeikan@gmail.com`) tetap dipakai penuh untuk Firestore & Authentication — hanya bagian **hosting**-nya yang pindah ke Netlify. Env var `VITE_FIREBASE_*` (lihat `.env.example`) perlu di-set juga di **Netlify → Site settings → Environment variables** (nilainya sama seperti isi `.env` lokal Anda), karena `.env` sengaja tidak ikut ter-commit ke GitHub.

⚠️ **Dua hal wajib dicek di Firebase Console setelah pindah ke domain Netlify:**
1. **Authentication → Settings → Authorized domains** → tambahkan domain Netlify Anda (mis. `nama-situs.netlify.app`, dan domain custom kalau ada). Tanpa ini, **Login dengan Google akan gagal** (error `auth/unauthorized-domain`).
2. **QR code mengikuti domain tempat admin login saat generate.** Generate & cetak QR dari admin panel di URL Netlify production (bukan `localhost`) sebelum ditempel ke produk asli.

## Struktur Data Firestore

- **`products`** — master data katalog produk (nama, kategori, deskripsi, foto base64, nilai gizi, status aktif/non-aktif).
- **`batches`** — satu dokumen per batch produksi, berisi data ketelusuran spesifik batch tsb (tangkapan/pengolahan/budidaya sesuai kategori produk) dan `batchCode` unik yang dipakai di URL QR code.

Lihat `src/utils/constants.js` untuk struktur field lengkap tiap kategori.

## Struktur Proyek

```
src/
  plugins/       konfigurasi Vuetify (tema MD3) & Firebase
  router/        routing publik + admin (dengan navigation guard)
  stores/        Pinia store: auth, products, batches
  layouts/       PublicLayout (katalog) & AdminLayout (control panel)
  views/public/  CatalogHome, ProductDetail, BatchTraceability
  views/admin/   Login, Dashboard, CRUD Produk, CRUD Batch, generator QR
  components/    komponen UI publik & admin (form ketelusuran per kategori, dll)
  utils/         konstanta kategori, helper QR code, kompresi foto, slug, generate kode batch
```

## Keamanan

`firestore.rules`: publik hanya bisa membaca produk/batch berstatus `active`; hanya user yang login (admin) yang bisa menulis/menghapus data. Tidak ada role granular — semua akun admin punya akses penuh ke Master Data.
