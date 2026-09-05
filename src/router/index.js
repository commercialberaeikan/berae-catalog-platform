import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'catalog-home', component: () => import('@/views/public/CatalogHome.vue') },
      { path: 'produk/:slug', name: 'product-detail', component: () => import('@/views/public/ProductDetail.vue') },
      { path: 'batch/:batchCode', name: 'batch-traceability', component: () => import('@/views/public/BatchTraceability.vue') },
      { path: 'tentang-kami', name: 'about-us', component: () => import('@/views/public/AboutView.vue') },
      { path: 'kontak', name: 'contact', component: () => import('@/views/public/ContactView.vue') },
      { path: 'artikel', name: 'articles', component: () => import('@/views/public/ArticlesView.vue') },
      { path: 'aktivitas-kami', name: 'activities', component: () => import('@/views/public/ActivitiesView.vue') },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: 'Dashboard', subtitle: 'Ringkasan katalog produk & batch produksi' },
      },
      {
        path: 'produk',
        name: 'admin-product-list',
        component: () => import('@/views/admin/ProductListView.vue'),
        meta: { title: 'Katalog Produk', subtitle: 'Kelola master data produk perikanan' },
      },
      { path: 'produk/baru', name: 'admin-product-new', component: () => import('@/views/admin/ProductFormView.vue') },
      { path: 'produk/:id/edit', name: 'admin-product-edit', component: () => import('@/views/admin/ProductFormView.vue') },
      {
        path: 'batch',
        name: 'admin-batch-list',
        component: () => import('@/views/admin/BatchListView.vue'),
        meta: { title: 'Batch Produksi', subtitle: 'Kelola data ketelusuran & generate QR code' },
      },
      { path: 'batch/baru', name: 'admin-batch-new', component: () => import('@/views/admin/BatchFormView.vue') },
      { path: 'batch/:id/edit', name: 'admin-batch-edit', component: () => import('@/views/admin/BatchFormView.vue') },
      { path: 'batch/:id/qr', name: 'admin-batch-qr', component: () => import('@/views/admin/BatchQRView.vue') },
      {
        path: 'preview',
        name: 'admin-preview',
        component: () => import('@/views/admin/PreviewView.vue'),
        meta: { title: 'Lihat sebagai Customer', subtitle: 'Preview tampilan katalog publik' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/public/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.waitUntilReady()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'admin-login' && authStore.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
  return true
})

export default router
