# Scentique — Frontend (Vue 3 + TypeScript)

Modern, responsive **Vue 3 SPA** for the Scentique luxury perfume e-commerce platform. Built with Composition API, Pinia state management, Vue Router 5, Tailwind CSS 4, and Vite 8.

[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Table of Contents

- [🛒 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [⚙ Environment Variables](#-environment-variables)
- [📂 Views & Routes](#-views--routes)
- [🔐 Authentication Flow](#-authentication-flow)
- [🗄 State Management](#-state-management)
- [🌐 API Integration](#-api-integration)
- [📦 Build & Deployment](#-build--deployment)
- [🧪 Linting & Formatting](#-linting--formatting)
- [🔍 Troubleshooting](#-troubleshooting)
- [📈 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🛒 Project Overview

Scentique is a luxury perfume e-commerce SPA (Single Page Application) that provides a smooth, app-like shopping experience. It communicates with the Laravel backend API via Axios and handles authentication, product browsing, cart/wishlist management, and checkout — all on the client side.

### 🎯 Main Purpose

Deliver a fast, responsive, and intuitive user interface for browsing and purchasing luxury perfumes, with seamless integration to the Laravel backend for data persistence and real-time Telegram notifications.

### 👥 Target Users

- **Customers** — Browse products, manage cart/wishlist, place orders, view order history
- **Admins** — Access admin panel routes for store management

### 🖼 Screenshots

> _Screenshots coming soon._

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Home Page** | Hero banner, category showcase, promotions, testimonials, blog section |
| 🛍 **Product Catalog** | Grid/list view with filters (category, brand, gender, price) and search |
| 🔍 **Product Detail** | Image gallery, reviews, ratings, add to cart/wishlist |
| 🛒 **Shopping Cart** | Drawer-based cart with quantity controls, guest + auth support |
| ❤️ **Wishlist** | Save/favorite products, merge on login |
| 🔐 **Authentication** | Register, login, Google OAuth, profile management |
| 📦 **Checkout** | Shipping address form, payment method selection, order summary |
| 📋 **Order History** | List of past orders with status tracking |
| 👤 **Profile** | Edit name/email, change password, Telegram connection settings |
| ⭐ **Reviews** | Rate and review products (authenticated users) |
| 🏷 **Promotions** | View and apply promotional codes |
| 🤖 **Telegram Settings** | Link/unlink Telegram account, toggle notifications |
| 📱 **Responsive Design** | Mobile-first with Tailwind CSS 4 gold-themed luxury UI |
| 🔔 **Toast Notifications** | Real-time feedback for actions (add to cart, login, errors) |
| 🌐 **Network Status** | Offline/online detection with status bar |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue** | ^3.5.38 | UI framework (Composition API + `<script setup>`) |
| **TypeScript** | ~6.0.0 | Type-safe JavaScript |
| **Pinia** | ^3.0.4 | State management |
| **Vue Router** | ^5.1.0 | Client-side routing (22 routes) |
| **Axios** | ^1.18.1 | HTTP client with interceptors |
| **Tailwind CSS** | ^4.3.1 | Utility-first CSS framework |
| **Vite** | ^8.0.16 | Build tool & dev server (HMR) |
| **ESLint** | ^10.5.0 | Code linting |
| **Prettier** | 3.8.4 | Code formatting |
| **oxlint** | ~1.69.0 | Rust-based linter (fast) |
| **vue-tsc** | ^3.3.5 | Type-checking |

---

## 📁 Project Structure

```
frontend/
├── public/                        # Static assets (favicon, etc.)
├── src/
│   ├── assets/
│   │   └── main.css               # Tailwind CSS + global styles
│   ├── api/                       # API endpoint constants
│   ├── components/                # Reusable Vue components
│   │   ├── auth/                  # Auth form fields (AuthTextField, AuthPasswordField)
│   │   ├── common/                # Shared (AppNavbar, Toast, ConfirmModal, NetworkStatus)
│   │   ├── home/                  # Homepage sections (HeroBanner, BannerSlider, etc.)
│   │   ├── layout/                # Layout components (AnnouncementBar, Footer, CartDrawer, SearchModal)
│   │   └── product/               # Product components (Card, Filters, QuickView, Reviews, etc.)
│   ├── composables/               # Reusable composition functions
│   │   ├── useAuthModal.ts        # Auth modal open/close logic
│   │   ├── useNetworkStatus.ts    # Online/offline detection
│   │   ├── useProductFilters.ts   # Filter state management
│   │   └── useToast.ts            # Toast notification queue
│   ├── config/
│   │   └── app.ts                 # App configuration (API URL, app name, version)
│   ├── features/
│   │   └── categories/            # Feature-sliced categories module
│   │       ├── index.ts           # Public API
│   │       ├── types.ts           # Category types
│   │       ├── components/        # CategoryFilter component
│   │       └── composables/       # useCategoryFilter composable
│   ├── plugins/
│   │   └── axios.ts               # Axios instance with interceptors (auth, guest token)
│   ├── router/
│   │   └── index.ts               # Vue Router configuration (22 routes)
│   ├── services/                  # API service modules
│   │   ├── authService.ts         # Register, login, logout, profile, password
│   │   ├── cartService.ts         # Cart CRUD, merge
│   │   ├── orderService.ts        # Checkout, order list, order detail, cancel
│   │   ├── productService.ts      # Products, categories, filters, reviews
│   │   ├── promotionService.ts    # Promotions list, validate
│   │   └── wishlistService.ts     # Wishlist CRUD, toggle, merge
│   ├── stores/                    # Pinia stores
│   │   ├── auth.ts                # User state, token, login/logout/register actions
│   │   ├── cart.ts                # Cart items, add/remove/update/merge
│   │   ├── product.ts             # Products, filters, categories, pagination
│   │   └── wishlist.ts            # Wishlist items, toggle, merge
│   ├── types/                     # TypeScript type definitions
│   │   ├── auth.ts                # User, RegisterPayload, LoginPayload
│   │   ├── axios.d.ts             # Axios type augmentations
│   │   ├── cart.ts                # CartItem
│   │   ├── product.ts             # Product, Category, Review, FilterOptions
│   │   └── promotion.ts           # Promotion
│   ├── utils/                     # Utility functions
│   │   ├── guest.ts               # Guest token generation & management
│   │   ├── image.ts               # Image URL helpers
│   │   └── price.ts               # Price formatting
│   └── views/                     # Page-level view components
│       ├── home/HomeView.vue
│       ├── products/ProductsView.vue
│       ├── products/ProductDetailView.vue
│       ├── cart/CartView.vue
│       ├── checkout/CheckoutView.vue
│       ├── auth/LoginView.vue
│       ├── auth/RegisterView.vue
│       ├── auth/OAuthCallbackView.vue
│       ├── orders/OrdersView.vue
│       ├── orders/OrderDetailView.vue
│       ├── wishlist/WishlistView.vue
│       ├── profile/ProfileView.vue
│       ├── settings/TelegramView.vue
│       ├── category/CategoryView.vue
│       ├── collections/CollectionsView.vue
│       ├── best-sellers/BestSellersView.vue
│       ├── new-arrivals/NewArrivalsView.vue
│       ├── brands/BrandsView.vue
│       ├── contact/ContactView.vue
│       ├── about/AboutView.vue
│       ├── DashboardView.vue
│       └── NotFoundView.vue
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration (Tailwind plugin, Vue plugin, devtools)
├── tsconfig.json                  # Root TypeScript config
├── tsconfig.app.json              # App TypeScript config
├── tsconfig.node.json             # Node TypeScript config
├── eslint.config.ts               # ESLint flat config
├── .prettierrc.json               # Prettier config (semi, singleQuote, tabWidth)
├── .oxlintrc.json                 # oxlint config
├── .env.example                   # Environment template
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

---

## 🚀 Installation

### Prerequisites

| Software | Version |
|----------|---------|
| Node.js | ^22.18 or >=24.12 |
| npm | Latest (included with Node.js) |

### 1. Clone Repository

```bash
git clone https://github.com/dane25006/e-commerce-backend.git

cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment

```bash
cp .env.example .env
```

### 4. Configure Environment

Open `.env` and set the API URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Scentique
VITE_APP_VERSION=1.0.0
```

> **💡 Tip:** Make sure the Laravel backend is running at `VITE_API_URL`.

### 5. Start Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** with hot module replacement.

---

## ⚙ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://127.0.0.1:8000/api` |
| `VITE_APP_NAME` | Application display name | `Scentique` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

> **⚠️ Note:** All Vite env vars must be prefixed with `VITE_` to be exposed to the client.

---

## 📂 Views & Routes

The app uses **Vue Router 5** with 22 routes.

| Path | View | Description |
|------|------|-------------|
| `/` | `HomeView` | Landing page with hero, categories, promotions, testimonials |
| `/products` | `ProductsView` | Product catalog with filters and search |
| `/products/:slug` | `ProductDetailView` | Product details, images, reviews |
| `/categories` | `CategoryView` | Products grouped by category |
| `/collections` | `CollectionsView` | Curated collections |
| `/best-sellers` | `BestSellersView` | Best-selling products |
| `/new-arrivals` | `NewArrivalsView` | Newest products |
| `/brands` | `BrandsView` | Browse by brand |
| `/cart` | `CartView` | Full cart page |
| `/checkout` | `CheckoutView` | Checkout form (auth required) |
| `/orders` | `OrdersView` | Order history (auth required) |
| `/orders/:id` | `OrderDetailView` | Single order details (auth required) |
| `/wishlist` | `WishlistView` | Saved products |
| `/login` | `LoginView` | Login form |
| `/register` | `RegisterView` | Registration form |
| `/auth/callback` | `OAuthCallbackView` | Google OAuth callback handler |
| `/profile` | `ProfileView` | Edit profile (auth required) |
| `/settings/telegram` | `TelegramView` | Telegram bot settings (auth required) |
| `/contact` | `ContactView` | Contact page |
| `/about` | `AboutView` | About page |
| `/dashboard` | `DashboardView` | User dashboard (auth required) |
| `/:pathMatch(.*)*` | `NotFoundView` | 404 catch-all |

---

## 🔐 Authentication Flow

### Register / Login

1. User submits credentials via `LoginView` or `RegisterView`
2. `authService.ts` sends POST to `/api/login` or `/api/register`
3. Backend returns user object + Sanctum token
4. `auth.ts` Pinia store saves the token and user
5. Token is stored in `localStorage` under the key from app config
6. Axios interceptor attaches `Authorization: Bearer <token>` to all requests

### Google OAuth

1. User clicks "Login with Google"
2. App redirects to `GET /api/auth/google/redirect`
3. User authenticates on Google
4. Google redirects to `GET /api/auth/google/callback?code=...`
5. Backend sends user to `FRONTEND_URL/auth/callback?token=...`
6. `OAuthCallbackView` extracts token from URL and saves it

### Guest Cart/Wishlist Merge

- Unauthenticated users get a **guest token** stored in `localStorage`
- Cart and wishlist operations work with `X-Guest-Token` header
- On login, `POST /api/cart/merge` and `POST /api/wishlist/merge` are called
- Guest items are transferred to the authenticated user's account

### Route Guards

- Protected routes (checkout, orders, profile, settings) check for token
- Unauthenticated users are redirected to login
- Auth modal can be triggered from any page via `useAuthModal` composable

---

## 🗄 State Management

The app uses **Pinia** with 4 stores:

### `auth.ts`
- **State:** `user`, `token`, `isAuthenticated`
- **Actions:** `login()`, `register()`, `logout()`, `fetchProfile()`, `updateProfile()`, `changePassword()`
- **Persistence:** Token saved to `localStorage` on login, cleared on logout

### `cart.ts`
- **State:** `items[]`, `isLoading`
- **Actions:** `fetchCart()`, `addItem()`, `updateQuantity()`, `removeItem()`, `clearCart()`, `mergeCart()`
- **Guest Support:** Uses guest token when user is not authenticated

### `wishlist.ts`
- **State:** `items[]`, `isLoading`
- **Actions:** `fetchWishlist()`, `toggleItem()`, `addItem()`, `removeItem()`, `mergeWishlist()`

### `product.ts`
- **State:** `products[]`, `categories[]`, `filters`, `pagination`, `isLoading`
- **Actions:** `fetchProducts()`, `fetchCategories()`, `fetchFilters()`, `fetchProduct()`, `fetchReviews()`

---

## 🌐 API Integration

### Axios Instance (`plugins/axios.ts`)

- Base URL from `VITE_API_URL` env var
- **Request interceptor:** Attaches `Authorization` header (token) and `X-Guest-Token` header
- **Response interceptor:** Handles 401 (logout), extracts data, normalizes errors
- `withCredentials: true` for Sanctum SPA authentication
- `Accept: application/json` header

### Service Modules

Each service module wraps API calls with typed functions:

```typescript
// Example: productService.ts
import api from '@/plugins/axios'
import type { Product, ProductFilters, PaginatedResponse } from '@/types/product'

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get('/products', { params: filters })
    return data
  },
  async getProduct(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`)
    return data
  }
}
```

---

## 📦 Build & Deployment

### Development

```bash
npm run dev
```

- Dev server at `http://localhost:5173`
- Hot Module Replacement (HMR)
- Vite Vue DevTools enabled

### Production Build

```bash
npm run build
```

Output is generated in `dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
└── favicon.ico
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

Serve the `dist/` folder from any static file server:

```bash
# Example: using nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> **⚠️ Note:** Since this is an SPA, configure your web server to rewrite all routes to `index.html` for client-side routing to work.

---

## 🧪 Linting & Formatting

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run lint` | Run all linters (oxlint + ESLint) with auto-fix |
| `npm run lint:oxlint` | Run oxlint (Rust-based, fast) with auto-fix |
| `npm run lint:eslint` | Run ESLint with auto-fix and caching |
| `npm run format` | Format all files with Prettier |
| `npm run typecheck` | Run TypeScript type checking via vue-tsc |

### Configuration

| Tool | Config File |
|------|-------------|
| **oxlint** | `.oxlintrc.json` |
| **ESLint** | `eslint.config.ts` (flat config) |
| **Prettier** | `.prettierrc.json` |
| **TypeScript** | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` |

---

## 🔍 Troubleshooting

### `npm install` fails

**Issue:** Dependency installation fails with errors.

**Solutions:**
- Verify Node.js version: `node --version` (must be ^22.18 or >=24.12)
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Dev server not starting

**Issue:** `npm run dev` throws an error.

**Solutions:**
- Ensure no other process is on port 5173:
  ```bash
  npx kill-port 5173
  ```
- Clear Vite cache:
  ```bash
  rm -rf node_modules/.vite
  ```

### API calls failing (CORS)

**Issue:** Browser blocks API requests due to CORS.

**Solutions:**
- Verify `VITE_API_URL` matches the backend URL exactly
- Ensure `SANCTUM_STATEFUL_DOMAINS` in `backend/.env` includes `localhost:5173`
- Check `config/cors.php` in backend for allowed origins
- Backend must be running: `php artisan serve` at `http://127.0.0.1:8000`

### Blank page in production

**Issue:** `dist/index.html` loads but shows nothing.

**Solutions:**
- Check browser console for JavaScript errors
- Ensure your web server rewrites all routes to `index.html`
- Clear browser cache: `Ctrl+Shift+R` (hard reload)
- Rebuild: `npm run build`

### TypeScript errors

**Issue:** `npm run typecheck` reports type errors.

**Solutions:**
- Run `npm install` to ensure all `@types/*` packages are installed
- Check `tsconfig.json` paths and references
- Restart your editor's TypeScript server

### HMR not working

**Issue:** Changes not reflecting in browser.

**Solutions:**
- Ensure you're on a modern browser (Chrome, Firefox, Edge)
- Check for Vite errors in terminal
- Restart the dev server: `Ctrl+C` then `npm run dev`

---

## 📈 Future Improvements

| Feature | Priority |
|---------|----------|
| **Dark Mode** | 🟡 Medium |
| **Infinite Scroll** | 🟡 Medium |
| **Advanced Search** (fuzzy, autocomplete) | 🟡 Medium |
| **Payment Form UI** (Stripe Elements) | 🟡 Medium |
| **Order Tracking Page** | 🟢 Low |
| **Product Comparison** | 🟢 Low |
| **Recently Viewed** | 🟢 Low |
| **PWA Support** (offline, installable) | 🟢 Low |
| **i18n Multi-language** | 🟢 Low |
| **E2E Tests** (Playwright/Cypress) | 🟢 Low |
| **Storybook** for component library | 🟢 Low |

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code refactoring |
| `style:` | Formatting, styling |
| `docs:` | Documentation |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance, dependencies |

### Guidelines

- Follow the existing code style (Prettier + ESLint will auto-format)
- Use TypeScript — avoid `any` where possible
- Keep components focused and composable
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Dane**

[![GitHub](https://img.shields.io/badge/GitHub-dane25006-181717?logo=github)](https://github.com/dane25006)

📧 **Email** — _your.email@example.com_

🔗 **LinkedIn** — _linkedin.com/in/yourusername_

🌐 **Portfolio** — _your-portfolio.com_

---

<p align="center">
  <sub>Built with ❤️ using Vue 3 + TypeScript + Tailwind CSS</sub>
</p>
