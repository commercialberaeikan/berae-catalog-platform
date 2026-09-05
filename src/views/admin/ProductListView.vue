<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { categoryColor, categoryLabel } from '@/utils/constants'

const router = useRouter()
const productsStore = useProductsStore()
const confirmDelete = ref(null)
const search = ref('')
const statusFilter = ref('all')

onMounted(() => productsStore.fetchAll())

const headers = [
  { title: 'Nama Produk', key: 'name' },
  { title: 'Kategori', key: 'category' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'end' },
]

const filteredItems = computed(() => {
  return productsStore.items.filter((p) => {
    const matchesSearch = !search.value || p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

async function handleDelete() {
  await productsStore.remove(confirmDelete.value.id)
  confirmDelete.value = null
  productsStore.fetchAll()
}

function previewProduct(item) {
  window.open(`${window.location.origin}/produk/${item.slug}`, '_blank')
}
</script>

<template>
  <v-container fluid class="py-6">
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'admin-product-new' })">
        Tambah Produk
      </v-btn>
    </div>

    <v-card variant="outlined" class="pa-4 mb-4">
      <div class="d-flex flex-wrap align-center ga-3">
        <v-text-field
          v-model="search"
          placeholder="Cari nama produk..."
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
          style="max-width: 320px"
        />
        <v-btn-toggle v-model="statusFilter" mandatory density="comfortable" color="primary" variant="outlined" divided>
          <v-btn value="all">Semua</v-btn>
          <v-btn value="active">Aktif</v-btn>
          <v-btn value="inactive">Non-aktif</v-btn>
        </v-btn-toggle>
      </div>
    </v-card>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="filteredItems" :loading="productsStore.loading">
        <template #item.category="{ item }">
          <v-chip size="small" :color="categoryColor(item.category)" variant="outlined">
            {{ categoryLabel(item.category) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip size="small" :color="item.status === 'active' ? 'success' : 'secondary'" variant="outlined">
            {{ item.status === 'active' ? 'Aktif' : 'Non-aktif' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn icon="mdi-eye-outline" variant="outlined" size="small" title="Lihat sebagai customer" @click="previewProduct(item)" />
            <v-btn icon="mdi-pencil-outline" variant="outlined" size="small" @click="router.push({ name: 'admin-product-edit', params: { id: item.id } })" />
            <v-btn icon="mdi-delete-outline" variant="outlined" size="small" color="error" @click="confirmDelete = item" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="confirmDelete" max-width="420" :model-value="!!confirmDelete">
      <v-card v-if="confirmDelete">
        <v-card-title>Hapus Produk?</v-card-title>
        <v-card-text>
          Yakin ingin menghapus <strong>{{ confirmDelete.name }}</strong>? Batch produksi yang terkait dengan produk ini tidak akan otomatis terhapus.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = null">Batal</v-btn>
          <v-btn color="error" variant="flat" @click="handleDelete">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
