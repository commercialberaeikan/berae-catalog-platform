import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

// Palet monokrom hitam-putih (gaya katalog e-commerce minimalis) untuk
// PT Berae Segara Nusantara. Warna dipakai seperlunya saja (badge kategori).
const beraeLight = {
  dark: false,
  colors: {
    background: '#F7F7F5',
    surface: '#FFFFFF',
    'surface-variant': '#EFEFEC',
    primary: '#111111',
    'primary-container': '#111111',
    'on-primary': '#FFFFFF',
    'on-primary-container': '#FFFFFF',
    secondary: '#5C5C5C',
    'secondary-container': '#EFEFEC',
    tertiary: '#8A5A2B',
    error: '#B3261E',
    success: '#1E7A46',
    warning: '#B26A00',
    'on-background': '#111111',
    'on-surface': '#111111',
    outline: '#D8D8D4',
  },
}

// Palet biru profesional untuk panel admin (dashboard internal — terpisah dari
// tema monokrom katalog publik). Diaktifkan oleh AdminLayout.vue saat masuk /admin.
const beraeAdminLight = {
  dark: false,
  colors: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    'surface-variant': '#EEF2F8',
    primary: '#2554C7',
    'primary-container': '#E4EBFB',
    'on-primary-container': '#12358A',
    secondary: '#64748B',
    'secondary-container': '#EEF2F8',
    tertiary: '#8A5A2B',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    'on-background': '#1E2430',
    'on-surface': '#1E2430',
    outline: '#C7D0DD',
  },
}

export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'beraeLight',
    themes: { beraeLight, beraeAdminLight },
  },
  defaults: {
    VBtn: { rounded: 'pill' },
    VCard: { rounded: 'xl' },
    VChip: { rounded: 'pill' },
    VDialog: { rounded: 'xl' },
    VAvatar: { rounded: 'circle' },
    VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'xl', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', rounded: 'xl', color: 'primary' },
    VTextarea: { variant: 'outlined', density: 'comfortable', rounded: 'xl', color: 'primary' },
    VList: { rounded: 'xl' },
  },
})
