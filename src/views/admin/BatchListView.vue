<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBatchesStore } from '@/stores/batches'
import { categoryColor, categoryLabel } from '@/utils/constants'

const router = useRouter()
const batchesStore = useBatchesStore()
const confirmDelete = ref(null)
const search = ref('')
const statusFilter = ref('all')

onMounted(() => batchesStore.fetchAll())

const headers = [
  { title: 'Kode Batch', key: 'batchCode' },
  { title: 'Produk', key: 'productSnapshot.name' },
  { title: 'Kategori', key: 'category' },
  { title: 'Status', key: 'status' },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'end' },
]

const filteredItems = computed(() => {
  return batchesStore.items.filter((b) => {
    const q = search.value.toLowerCase()
    const matchesSearch =
      !q || b.batchCode.toLowerCase().includes(q) || b.productSnapshot?.name?.toLowerCase().includes(q)
    const matchesStatus = statusFilter.value === 'all' || b.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

async function handleDelete() {
  await batchesStore.remove(confirmDelete.value.id)
  confirmDelete.value = null
  batchesStore.fetchAll()
}

</script>

<template>
  <v-container fluid class="py-6">
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'admin-batch-new' })">
        Tambah Batch
      </v-btn>
    </div>

    <v-card variant="outlined" class="pa-4 mb-4">
      <div class="d-flex flex-wrap align-center ga-3">
        <v-text-field
          v-model="search"
          placeholder="Cari kode batch atau nama produk..."
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
          style="max-width: 320px"
        />
        <v-btn-toggle v-model="statusFilter" mandatory density="comfortable" color="primary" variant="outlined" divided>
          <v-btn value="all">Semua</v-btn>
          <v-btn value="active">Aktif</v-btn>
          <v-btn value="archived">Diarsipkan</v-btn>
        </v-btn-toggle>
      </div>
    </v-card>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="filteredItems" :loading="batchesStore.loading">
        <template #item.productSnapshot.name="{ item }">
          {{ item.productSnapshot?.name ?? '-' }}
        </template>
        <template #item.category="{ item }">
          <v-chip size="small" :color="categoryColor(item.productSnapshot?.category)" variant="outlined">
            {{ categoryLabel(item.productSnapshot?.category) }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip size="small" :color="item.status === 'active' ? 'success' : 'secondary'" variant="outlined">
            {{ item.status === 'active' ? 'Aktif' : 'Diarsipkan' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-btn icon="mdi-qrcode" variant="outlined" size="small" @click="router.push({ name: 'admin-batch-qr', params: { id: item.id } })" />
            <v-btn icon="mdi-pencil-outline" variant="outlined" size="small" @click="router.push({ name: 'admin-batch-edit', params: { id: item.id } })" />
            <v-btn icon="mdi-delete-outline" variant="outlined" size="small" color="error" @click="confirmDelete = item" />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="confirmDelete" max-width="420" :model-value="!!confirmDelete">
      <v-card v-if="confirmDelete">
        <v-card-title>Hapus Batch?</v-card-title>
        <v-card-text>
          Yakin ingin menghapus batch <strong>{{ confirmDelete.batchCode }}</strong>? QR code yang sudah dicetak untuk batch ini tidak akan berfungsi lagi.
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
