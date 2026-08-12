import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bannerService } from '@/services/bannerService'
import type { Banner } from '@/types/banner'

export const useBannerStore = defineStore('banner', () => {
  const banners = ref<Banner[]>([])
  const bannerMap = ref<Record<string, Banner | null>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBanners() {
    loading.value = true
    error.value = null
    try {
      const res = await bannerService.getAll()
      banners.value = res.data.data
      const map: Record<string, Banner | null> = {}
      for (const b of res.data.data) {
        if (!map[b.placement]) {
          map[b.placement] = b
        }
      }
      bannerMap.value = map
    } catch (err: any) {
      error.value = err.message || 'Failed to load banners'
    } finally {
      loading.value = false
    }
  }

  async function fetchBannerByPlacement(placement: string): Promise<Banner | null> {
    if (bannerMap.value[placement] !== undefined) {
      return bannerMap.value[placement]
    }
    try {
      const res = await bannerService.getByPlacement(placement)
      const banner = res.data.data
      bannerMap.value[placement] = banner
      return banner
    } catch (err: any) {
      console.warn(`Failed to fetch banner for ${placement}:`, err)
      return null
    }
  }

  function getBanner(placement: string): Banner | null {
    return bannerMap.value[placement] || null
  }

  return {
    banners,
    bannerMap,
    loading,
    error,
    fetchBanners,
    fetchBannerByPlacement,
    getBanner,
  }
})
