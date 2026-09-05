<script setup>
import CertificationBadges from './CertificationBadges.vue'

const props = defineProps({
  category: { type: String, required: true },
  batch: { type: Object, required: true },
})

function fmtDate(value) {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return value
  }
}
</script>

<template>
  <v-timeline side="end" align="start" density="comfortable">
    <!-- Tangkapan, atau Olahan bersumber tangkapan: mulai dari penangkapan -->
    <template v-if="(category === 'tangkapan' || (category === 'olahan' && batch.sourceType !== 'budidaya')) && batch.capture">
      <v-timeline-item dot-color="primary" icon="mdi-sail-boat" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Penangkapan</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Lokasi tangkap:</strong> {{ batch.capture.location || '-' }}</div>
            <div><strong>Tanggal tangkap:</strong> {{ fmtDate(batch.capture.catchDate) }}</div>
            <div><strong>Cara penangkapan:</strong> {{ batch.capture.fishingMethod || '-' }}</div>
            <div><strong>Penanganan awal:</strong> {{ batch.capture.handling || '-' }}</div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>

    <!-- Olahan bersumber budidaya: mulai dari pembenihan & budidaya -->
    <template v-if="category === 'olahan' && batch.sourceType === 'budidaya' && batch.aquaculture">
      <v-timeline-item dot-color="secondary" icon="mdi-egg-outline" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Pembenihan</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Asal induk:</strong> {{ batch.aquaculture.broodstockOrigin || '-' }}</div>
            <div><strong>Tanggal pemijahan:</strong> {{ fmtDate(batch.aquaculture.spawningDate) }}</div>
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="secondary" icon="mdi-fishbowl" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Budidaya & Panen</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Lokasi budidaya:</strong> {{ batch.aquaculture.farmLocation || '-' }}</div>
            <div><strong>Pakan:</strong> {{ batch.aquaculture.feed || '-' }}</div>
            <div><strong>Tanggal panen:</strong> {{ fmtDate(batch.aquaculture.harvestDate) }}</div>
            <div><strong>Penanganan pasca panen:</strong> {{ batch.aquaculture.postHarvestHandling || '-' }}</div>
          </v-card-text>
          <v-card-text v-if="batch.aquaculture.certifications?.length">
            <div class="text-subtitle-2 mb-2">Sertifikasi</div>
            <CertificationBadges :certifications="batch.aquaculture.certifications" />
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>

    <!-- Olahan: tahap pengolahan -->
    <template v-if="category === 'olahan' && batch.processing">
      <v-timeline-item dot-color="tertiary" icon="mdi-food-drumstick" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Pengolahan</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Lokasi pengolahan:</strong> {{ batch.processing.location || '-' }}</div>
            <div><strong>Tanggal pengolahan:</strong> {{ fmtDate(batch.processing.processingDate) }}</div>
            <div><strong>Kondisi penyimpanan:</strong> {{ batch.processing.storageCondition || '-' }}</div>
          </v-card-text>
          <v-card-text v-if="batch.processing.certifications?.length">
            <div class="text-subtitle-2 mb-2">Sertifikasi</div>
            <CertificationBadges :certifications="batch.processing.certifications" />
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>

    <!-- Budidaya: ketelusuran lengkap dari pembenihan hingga panen -->
    <template v-if="category === 'budidaya' && batch.aquaculture">
      <v-timeline-item dot-color="secondary" icon="mdi-egg-outline" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Pembenihan</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Asal induk:</strong> {{ batch.aquaculture.broodstockOrigin || '-' }}</div>
            <div><strong>Tanggal pemijahan:</strong> {{ fmtDate(batch.aquaculture.spawningDate) }}</div>
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="secondary" icon="mdi-fishbowl" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Budidaya</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Lokasi budidaya:</strong> {{ batch.aquaculture.farmLocation || '-' }}</div>
            <div><strong>Pakan:</strong> {{ batch.aquaculture.feed || '-' }}</div>
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item dot-color="secondary" icon="mdi-basket" size="small">
        <v-card variant="outlined">
          <v-card-item>
            <v-card-title class="text-subtitle-1">Panen & Penanganan</v-card-title>
          </v-card-item>
          <v-card-text>
            <div><strong>Tanggal panen:</strong> {{ fmtDate(batch.aquaculture.harvestDate) }}</div>
            <div><strong>Penanganan pasca panen:</strong> {{ batch.aquaculture.postHarvestHandling || '-' }}</div>
          </v-card-text>
          <v-card-text v-if="batch.aquaculture.certifications?.length">
            <div class="text-subtitle-2 mb-2">Sertifikasi</div>
            <CertificationBadges :certifications="batch.aquaculture.certifications" />
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>
