import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService, type ProductParams } from '@/services/productService'
import type { Product, FilterValues } from '@/types/product'

export interface Filters {
  search:      string
  category_id: number | undefined
  gender:      string[] | undefined
  brand:       string[] | undefined
  type:        string[] | undefined
  department:  string[] | undefined
  min_price:   number | undefined
  max_price:   number | undefined
  in_stock:    boolean | undefined
  sort:        ProductParams['sort']
  per_page:    number
  page:        number
}

export interface UseProductFiltersOptions {
  defaultSort?: ProductParams['sort']
  perPage?: number
}

export function useProductFilters(opts: UseProductFiltersOptions = {}) {
  const defaultSort = opts.defaultSort || 'newest'
  const perPage = opts.perPage || 12

  const route = useRoute()
  const router = useRouter()

  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref('')
  const meta = ref<{ current_page: number; last_page: number; total: number } | null>(null)
  const quickViewProduct = ref<Product | null>(null)
  const searchOpen = ref(false)
  const cartOpen = ref(false)
  const showMobileFilters = ref(false)
  const currentPrice = ref(300)

  const filterOptions = reactive<FilterValues>({
    genders: [],
    brands: [],
    types: [],
    departments: [],
  })

  const filterOpen = reactive<Record<string, boolean>>({
    gender: true,
    categories: true,
    brand: true,
    type: true,
    department: true,
    price: true,
    availability: true,
  })

  function parseArr(key: string): string[] | undefined {
    const v = route.query[key] as string | undefined
    if (!v) return undefined
    return v.split(',')
  }

  const filters = ref<Filters>({
    search: (route.query.search as string) || '',
    category_id: route.query.category_id ? Number(route.query.category_id) : undefined,
    gender: parseArr('gender'),
    brand: parseArr('brand'),
    type: parseArr('type'),
    department: parseArr('department'),
    min_price: undefined,
    max_price: route.query.max_price ? Number(route.query.max_price) : undefined,
    in_stock: route.query.in_stock !== undefined ? route.query.in_stock !== 'false' : undefined,
    sort: (route.query.sort as ProductParams['sort']) || defaultSort,
    per_page: perPage,
    page: route.query.page ? Number(route.query.page) : 1,
  })

  const maxPrice = computed(() => {
    const prices = products.value.map(p => Number(p.price))
    return prices.length ? Math.max(...prices, 300) : 300
  })

  function openQuickView(product: Product) {
    quickViewProduct.value = product
  }

  let searchTimer: ReturnType<typeof setTimeout>

  function onFilterChange() {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { syncQueryParams(); loadProducts() }, 350)
  }

  function toggleFilter(key: 'gender' | 'brand' | 'type' | 'department', value: string) {
    const arr = filters.value[key]
    if (!arr) {
      filters.value[key] = [value]
    } else {
      const idx = arr.indexOf(value)
      if (idx >= 0) {
        arr.splice(idx, 1)
        if (arr.length === 0) filters.value[key] = undefined
      } else {
        arr.push(value)
      }
    }
    filters.value.page = 1
    onFilterChange()
  }

  function onPriceInput(e: Event) {
    const val = Number((e.target as HTMLInputElement).value)
    currentPrice.value = val
    filters.value.max_price = val >= maxPrice.value ? undefined : val
    filters.value.page = 1
    onFilterChange()
  }

  function countsBy(field: string, value: string): number {
    return products.value.filter((p: Record<string, unknown>) => String(p[field] ?? '') === value).length
  }

  const activeChips = computed(() => {
    const chips: { key: string; value: string; label: string; remove: () => void }[] = []
    const fields = ['gender', 'brand', 'type', 'department'] as const
    for (const f of fields) {
      const arr = filters.value[f]
      if (arr) {
        for (const v of arr) {
          chips.push({
            key: f,
            value: v,
            label: v,
            remove: () => toggleFilter(f, v),
          })
        }
      }
    }
    if (filters.value.in_stock === false) {
      chips.push({
        key: 'in_stock',
        value: 'false',
        label: 'In stock',
        remove: () => { filters.value.in_stock = undefined; onFilterChange() },
      })
    }
    return chips
  })

  const filteredCount = computed(() => products.value.length)

  const paginationPages = computed(() => {
    if (!meta.value) return []
    const { current_page, last_page } = meta.value
    const pages: (number | string)[] = []
    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current_page > 3) pages.push('...')
      for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i)
      if (current_page < last_page - 2) pages.push('...')
      pages.push(last_page)
    }
    return pages
  })

  function syncQueryParams() {
    const q: Record<string, string> = {}
    if (filters.value.search) q.search = filters.value.search
    if (filters.value.category_id) q.category_id = String(filters.value.category_id)
    if (filters.value.gender?.length) q.gender = filters.value.gender.join(',')
    if (filters.value.brand?.length) q.brand = filters.value.brand.join(',')
    if (filters.value.type?.length) q.type = filters.value.type.join(',')
    if (filters.value.department?.length) q.department = filters.value.department.join(',')
    if (filters.value.max_price) q.max_price = String(filters.value.max_price)
    if (filters.value.in_stock === false) q.in_stock = 'false'
    if (filters.value.sort) q.sort = filters.value.sort
    if (filters.value.page && filters.value.page > 1) q.page = String(filters.value.page)
    router.replace({ query: q })
  }

  async function loadProducts() {
    loading.value = true
    error.value = ''
    try {
      const params: ProductParams = {
        search: filters.value.search || undefined,
        category_id: filters.value.category_id,
        gender: filters.value.gender?.join(','),
        brand: filters.value.brand?.join(','),
        type: filters.value.type?.join(','),
        department: filters.value.department?.join(','),
        min_price: undefined,
        max_price: filters.value.max_price,
        in_stock: filters.value.in_stock,
        sort: filters.value.sort,
        per_page: perPage,
        page: filters.value.page,
      }
      const { data } = await productService.getAll(params)
      products.value = data.products.data
      meta.value = {
        current_page: data.products.current_page,
        last_page: data.products.last_page,
        total: data.products.total,
      }
    } catch {
      error.value = 'Failed to load products. Please try again.'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  function goToPage(page: number) {
    if (!meta.value) return
    if (page < 1 || page > meta.value.last_page) return
    filters.value.page = page
    syncQueryParams()
    loadProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    filters.value = {
      search: '',
      category_id: undefined,
      gender: undefined,
      brand: undefined,
      type: undefined,
      department: undefined,
      min_price: undefined,
      max_price: undefined,
      in_stock: undefined,
      sort: defaultSort,
      per_page: perPage,
      page: 1,
    }
    currentPrice.value = 300
    router.replace({ query: {} })
    loadProducts()
  }

  watch(() => filters.value.search, () => onFilterChange())

  onMounted(async () => {
    const maxP = route.query.max_price ? Number(route.query.max_price) : 300
    currentPrice.value = maxP
    await productService.getFilters().then(({ data }) => {
      filterOptions.genders = data.genders
      filterOptions.brands = data.brands
      filterOptions.types = data.types
      filterOptions.departments = data.departments
    }).catch(() => {})
    loadProducts()
  })

  return {
    products, loading, error, meta, searchOpen, cartOpen, quickViewProduct,
    showMobileFilters, currentPrice, filters, filterOptions, filterOpen,
    maxPrice, filteredCount, activeChips, paginationPages,
    openQuickView, toggleFilter, onPriceInput, onFilterChange, countsBy,
    loadProducts, goToPage, handleReset,
  }
}
