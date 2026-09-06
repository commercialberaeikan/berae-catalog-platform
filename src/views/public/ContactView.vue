<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const MAPS_EMBED_URL = 'https://www.google.com/maps?q=PT+Berae+Segara+Nusantara,-6.1094488,106.8004392&z=17&output=embed'
const MAPS_LINK = 'https://maps.app.goo.gl/RTckdT8LCXXJr39k7'
const WHATSAPP_NUMBER_DISPLAY = '0857-7805-3118'
const WHATSAPP_TEL_HREF = 'tel:+6285778053118'

const CONTACT_ITEMS = [
  { icon: 'mdi-phone-outline', label: 'Telepon / WhatsApp', value: WHATSAPP_NUMBER_DISPLAY, href: WHATSAPP_TEL_HREF, external: false },
  { icon: 'mdi-email-outline', label: 'Email', value: 'admin@beraeikan.site', href: 'mailto:admin@beraeikan.site', external: false },
  { icon: 'mdi-email-outline', label: 'Email Marketing', value: 'marketing@beraeikan.site', href: 'mailto:marketing@beraeikan.site', external: false },
  { icon: 'mdi-instagram', label: 'Instagram', value: '@beraeikan', href: 'https://instagram.com/beraeikan', external: true },
  { icon: 'mdi-music-note-outline', label: 'TikTok', value: '@berae.ikan', href: 'https://www.tiktok.com/@berae.ikan', external: true },
  { icon: 'mdi-linkedin', label: 'LinkedIn', value: 'PT Berae Segara Nusantara', href: null, external: false },
]

onMounted(() => {
  settingsStore.fetchCompany()
})
</script>

<template>
  <div class="hero-banner py-14 py-md-20 text-center">
    <v-container>
      <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-3">Kontak</h1>
      <p class="text-body-1 text-white opacity-80 mb-0 mx-auto" style="max-width: 560px">
        Ada pertanyaan tentang produk atau kerja sama? Hubungi kami.
      </p>
    </v-container>
  </div>

  <v-container class="py-10 py-md-14">
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" rounded="xl" class="overflow-hidden h-100" style="min-height: 320px">
          <iframe
            :src="MAPS_EMBED_URL"
            width="100%"
            height="100%"
            style="border: 0; min-height: 320px; display: block"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Lokasi PT Berae Segara Nusantara"
          />
        </v-card>
        <v-btn
          :href="MAPS_LINK"
          target="_blank"
          rel="noopener"
          variant="text"
          color="primary"
          size="small"
          class="mt-3"
          append-icon="mdi-open-in-new"
        >
          Buka di Google Maps
        </v-btn>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" rounded="xl" class="pa-6 pa-md-8 h-100 d-flex flex-column">
          <div class="text-h6 font-weight-bold mb-1">
            {{ settingsStore.company?.name || 'PT Berae Segara Nusantara' }}
          </div>
          <p class="text-body-2 text-medium-emphasis mb-6">Produk Perikanan Tertelusuri</p>

          <div class="contact-grid flex-grow-1">
            <div v-if="settingsStore.company?.address" class="contact-tile contact-tile--wide">
              <v-avatar color="#EAF0FD" size="40" class="mr-3">
                <v-icon icon="mdi-map-marker-outline" color="#2554C7" size="20" />
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">Alamat</div>
                <div class="font-weight-medium contact-value">{{ settingsStore.company.address }}</div>
              </div>
            </div>

            <component
              :is="item.href ? 'a' : 'div'"
              v-for="item in CONTACT_ITEMS"
              :key="item.label"
              :href="item.href ?? undefined"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener' : undefined"
              class="contact-tile"
            >
              <v-avatar color="#EAF0FD" size="40" class="mr-3">
                <v-icon :icon="item.icon" color="#2554C7" size="20" />
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis">{{ item.label }}</div>
                <div class="font-weight-medium contact-value">{{ item.value }}</div>
              </div>
            </component>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}
.contact-tile {
  display: flex;
  align-items: center;
  padding: 14px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgb(var(--v-theme-outline));
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
a.contact-tile:hover {
  background: #eaf0fd;
  border-color: #2554c7;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}
.contact-tile--wide {
  grid-column: 1 / -1;
}
.contact-value {
  font-size: 13.5px;
  word-break: break-word;
}
@media (max-width: 599.98px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
