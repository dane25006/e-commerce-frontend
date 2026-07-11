import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/home/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/auth/callback',
    name: 'oauth-callback',
    component: () => import('@/views/auth/OAuthCallbackView.vue'),
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: () => import('@/views/category/CategoryView.vue'),
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/products/ProductsView.vue'),
  },
  {
    path: '/products/:id',
    name: 'product',
    component: () => import('@/views/products/ProductDetailView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/cart/CartView.vue'),
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/wishlist/WishlistView.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/orders/OrdersView.vue'),
    meta: { auth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/orders/OrderDetailView.vue'),
    meta: { auth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: { auth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/notifications/NotificationsView.vue'),
    meta: { auth: true },
  },
  {
    path: '/settings/telegram',
    name: 'settings-telegram',
    component: () => import('@/views/settings/TelegramView.vue'),
    meta: { auth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { auth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutView.vue'),
    meta: { auth: true },
  },
  {
    path: '/payment/bakong/:orderId',
    name: 'payment-bakong',
    component: () => import('@/views/payment/PaymentBakongView.vue'),
    meta: { auth: true },
  },
  {
    path: '/payment/khqr/:orderId',
    name: 'payment-khqr-modern',
    component: () => import('@/views/payment/ModernPaymentView.vue'),
    meta: { auth: true },
  },
  {
    path: '/payment/premium/:orderId',
    name: 'payment-premium',
    component: () => import('@/views/payment/PremiumPaymentView.vue'),
    meta: { auth: true },
  },
  {
    path: '/top-up',
    name: 'top-up',
    component: () => import('@/views/payment/TopUpView.vue'),
    meta: { auth: true },
  },
  {
    path: '/new-arrivals',
    name: 'new-arrivals',
    component: () => import('@/views/new-arrivals/NewArrivalsView.vue'),
  },
  {
    path: '/best-sellers',
    name: 'best-sellers',
    component: () => import('@/views/best-sellers/BestSellersView.vue'),
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import('@/views/collections/CollectionsView.vue'),
  },
  {
    path: '/brands',
    name: 'brands',
    component: () => import('@/views/brands/BrandsView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/about/AboutView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/contact/ContactView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  const urlToken = (to.query.auth_token as string) || (to.query.token as string)
  if (urlToken && to.name !== 'oauth-callback') {
    return { name: 'oauth-callback', query: { token: urlToken } }
  }

  if (to.name === 'oauth-callback') {
    return
  }

  if (!auth.initialized) {
    await auth.boot()
  }

  if (to.meta.auth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
