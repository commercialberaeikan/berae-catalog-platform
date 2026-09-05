export const PRODUCT_CATEGORIES = [
  { value: 'tangkapan', title: 'Produk Tangkapan', icon: 'mdi-sail-boat', color: '#1D4E89' },
  { value: 'olahan', title: 'Produk Olahan', icon: 'mdi-food-drumstick', color: '#2F6F4E' },
  { value: 'budidaya', title: 'Produk Budidaya', icon: 'mdi-fishbowl', color: '#8A5A2B' },
]

export function categoryLabel(value) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.title ?? value
}

export function categoryIcon(value) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.icon ?? 'mdi-fish'
}

export function categoryColor(value) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.color ?? 'primary'
}

export const PRODUCT_STATUS = [
  { value: 'active', title: 'Aktif' },
  { value: 'inactive', title: 'Non-aktif' },
]

export const BATCH_STATUS = [
  { value: 'active', title: 'Aktif' },
  { value: 'archived', title: 'Diarsipkan' },
]

export function emptyNutritionFacts() {
  return {
    servingSize: '',
    calories: null,
    protein: null,
    fat: null,
    carbs: null,
    others: [],
  }
}

export function emptyCapture() {
  return {
    location: '',
    catchDate: '',
    fishingMethod: '',
    handling: '',
  }
}

export function emptyProcessing() {
  return {
    location: '',
    processingDate: '',
    storageCondition: '',
    certifications: [],
  }
}

export function emptyAquaculture() {
  return {
    broodstockOrigin: '',
    spawningDate: '',
    farmLocation: '',
    harvestDate: '',
    feed: '',
    postHarvestHandling: '',
    certifications: [],
  }
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Generate kode batch: BRE-<kategori3huruf>-<yyyymmdd>-<random4> */
export function generateBatchCode(category) {
  const prefix = { tangkapan: 'TKP', olahan: 'OLH', budidaya: 'BDY' }[category] ?? 'GEN'
  const today = new Date()
  const ymd = today.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BRE-${prefix}-${ymd}-${rand}`
}
