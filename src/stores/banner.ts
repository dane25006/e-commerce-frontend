import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bannerService } from '@/services/bannerService'
import type { Banner } from '@/types/banner'

function normalizePlacement(key: string): string {
  const norm = key.toLowerCase().trim().replace(/-/g, '_')
  const aliases: Record<string, string> = {
    products: 'all_fragrances',
    product: 'all_fragrances',
    all_products: 'all_fragrances',
    fragrances: 'all_fragrances',
    new_arrivals: 'new_arrivals',
    best_sellers: 'best_sellers',
    order: 'orders',
  }
  return aliases[norm] || norm
}

export const useBannerStore = defineStore('banner', () => {
  const banners = ref<Banner[]>([])
  const bannerMap = ref<Record<string, Banner | null>>({})
  const loading = ref(false)
  const isLoaded = ref(false)
  const error = ref<string | null>(null)
  let fetchPromise: Promise<void> | null = null

  async function fetchBanners(force = false) {
    if (isLoaded.value && !force) return
    if (fetchPromise && !force) return fetchPromise

    loading.value = true
    error.value = null
    fetchPromise = (async () => {
      try {
        const res = await bannerService.getAll()
        const items = res.data.data || []
        banners.value = items
        const map: Record<string, Banner | null> = {}
        for (const b of items) {
          const norm = normalizePlacement(b.placement)
          map[norm] = b
          map[b.placement] = b
          map[b.placement.replace(/_/g, '-')] = b
        }
        bannerMap.value = map
        isLoaded.value = true
      } catch (err: any) {
        error.value = err.message || 'Failed to load banners'
      } finally {
        loading.value = false
        fetchPromise = null
      }
    })()

    return fetchPromise
  }

  async function fetchBannerByPlacement(placement: string): Promise<Banner | null> {
    const key = normalizePlacement(placement)
    if (bannerMap.value[key] !== undefined) {
      return bannerMap.value[key]
    }

    // Try fetching all if not loaded yet
    if (!isLoaded.value) {
      await fetchBanners()
      if (bannerMap.value[key] !== undefined) {
        return bannerMap.value[key]
      }
    }

    try {
      const res = await bannerService.getByPlacement(key)
      const banner = res.data.data
      bannerMap.value[key] = banner
      bannerMap.value[placement] = banner
      return banner
    } catch (err: any) {
      console.warn(`Failed to fetch banner for ${placement}:`, err)
      bannerMap.value[key] = null
      return null
    }
  }

  function getBanner(placement: string): Banner | null {
    const key = normalizePlacement(placement)
    return bannerMap.value[key] || bannerMap.value[placement] || null
  }

  return {
    banners,
    bannerMap,
    loading,
    isLoaded,
    error,
    fetchBanners,
    fetchBannerByPlacement,
    getBanner,
  }
})
