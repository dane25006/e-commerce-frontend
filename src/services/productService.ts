import api from '@/plugins/axios'
import type { ProductsResponse, Product, Category } from '@/types/product'

export interface ProductParams {
  search?:      string
  category_id?: number
  min_price?:   number
  max_price?:   number
  sort?:        'newest' | 'price_asc' | 'price_desc' | 'name_asc'
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
}