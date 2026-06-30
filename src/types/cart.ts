export interface CartProduct {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  image_url: string | null
  category: { id: number; name: string } | null
}

export interface CartItem {
  cart_id: number
  quantity: number
  status: string
  subtotal: number
  product: CartProduct
}

export interface CartResponse {
  cart: CartItem[]
  item_count: number
  line_count: number
  total: number
}