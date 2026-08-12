import api from '@/plugins/axios'
import type { Banner } from '@/types/banner'

export const bannerService = {
  getAll: (placement?: string) =>
    api.get<{ status: string; data: Banner[] }>('/banners', { params: { placement } }),

  getByPlacement: (placement: string) =>
    api.get<{ status: string; data: Banner | null }>(`/banners/${placement}`),
}
