import api from '@/plugins/axios'
import type { ProductsResponse, Product, Category, FilterValues } from '@/types/product'

export interface ProductParams {
  search?:      string
  category_id?: number
  gender?:      string
  brand?:       string
  type?:        string
  department?:  string
  min_price?:   number
  max_price?:   number
  in_stock?:    boolean
  sort?:        'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'rating'
  per_page?:    number
  page?:        number
}

export const productService = {
  getAll:       (params?: ProductParams) =>
    api.get<ProductsResponse>('/products', { params }),

  getOne:       (id: number) =>
    api.get<{ product: Product }>(`/products/${id}`),

  getCategories: () =>
    api.get<{ categories: Category[] }>('/categories'),

  getFilters: () =>
    api.get<FilterValues>('/filters'),
}