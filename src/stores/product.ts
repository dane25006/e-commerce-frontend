import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { productService, type ProductParams } from '@/services/productService'
import type { Product, Category, ProductMeta } from '@/types/product'

export const useProductStore = defineStore('product', () => {

  const products   = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const meta       = ref<ProductMeta | null>(null)
  const loading    = ref(false)
  const error      = ref<string | null>(null)
  const detail     = ref<Product | null>(null)
  const detailLoading = ref(false)

  const filters = reactive<ProductParams>({
    search:      '',
    category_id: undefined,
    min_price:   undefined,
    max_price:   undefined,
    sort:        'newest',
    per_page:    12,
    page:        1,
  })

  async function fetchProducts(params?: ProductParams) {
    loading.value = true
    error.value   = null
    try {
      const merged = { ...filters, ...params }
      // strip empty strings
      Object.keys(merged).forEach(k => {
        const key = k as keyof ProductParams
        if (merged[key] === '' || merged[key] === undefined) delete merged[key]
      })
      const { data } = await productService.getAll(merged)
      products.value = data.products.data
      meta.value = {
        current_page: data.products.current_page,
        last_page:    data.products.last_page,
        total:        data.products.total,
        per_page:     data.products.per_page,
      }
    } catch {
      error.value = 'Failed to load products.'
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await productService.getCategories()
      categories.value = data.categories
    } catch {
      categories.value = []
    }
  }

  async function fetchProduct(id: number) {
    detailLoading.value = true
    detail.value = null
    try {
      const { data } = await productService.getOne(id)
      detail.value = data.product
    } catch {
      detail.value = null
    } finally {
      detailLoading.value = false
    }
  }

  function resetFilters() {
    filters.search      = ''
    filters.category_id = undefined
    filters.min_price   = undefined
    filters.max_price   = undefined
    filters.sort        = 'newest'
    filters.page        = 1
  }

  return {
    products, categories, meta, loading, error,
    detail, detailLoading, filters,
    fetchProducts, fetchCategories, fetchProduct, resetFilters,
  }
})