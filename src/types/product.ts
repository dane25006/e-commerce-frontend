export interface Category {
  id: number
  name: string
  slug: string
  products_count?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image_url: string | null
  category: Category | null
  created_at: string
  rating_avg?: number | null
  rating_count?: number
  reviews?: Review[]
  related?: RelatedProduct[]
}

export interface Review {
  id: number
  user_id: number
  user_name: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export interface RelatedProduct {
  id: number
  name: string
  stock: number
  price: number
  image_url: string | null
}

export interface ProductMeta {
  current_page: number
  last_page:    number
  total:        number
  per_page:     number
}

export interface ProductsResponse {
  products: {
    data:         Product[]
    current_page: number
    last_page:    number
    total:        number
    per_page:     number
  }
  meta: ProductMeta
}