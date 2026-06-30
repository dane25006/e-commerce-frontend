export interface StaticCategory {
  label: string
  slug: string
  icon: string
}

export const staticCategories: StaticCategory[] = [
  { label: 'For Her', slug: 'for-her', icon: 'ti-heart' },
  { label: 'For Him', slug: 'for-him', icon: 'ti-user' },
  { label: 'Unisex', slug: 'unisex', icon: 'ti-gender-bigender' },
  { label: 'Best Sellers', slug: 'best-sellers', icon: 'ti-crown' },
  { label: 'New Arrivals', slug: 'new-arrivals', icon: 'ti-sparkles' },
  { label: 'Gift Sets', slug: 'gift-sets', icon: 'ti-gift' },
  { label: 'Travel Size', slug: 'travel-size', icon: 'ti-plane' },
]

export const categoryFilterMap: Record<string, Partial<{ gender: string; sort: string; type: string }>> = {
  'For Her': { gender: 'female' },
  'For Him': { gender: 'male' },
  'Unisex': { gender: 'unisex' },
  'Best Sellers': { sort: 'rating' },
  'New Arrivals': { sort: 'newest' },
  'Gift Sets': { type: 'gift' },
  'Travel Size': { type: 'travel' },
}
