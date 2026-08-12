export interface Banner {
  id: number
  title: string
  subtitle: string | null
  badge: string | null
  placement: string
  image: string | null
  cta_text: string | null
  cta_link: string | null
  text_align: 'center' | 'left' | 'right'
  overlay_opacity: number
  is_active: boolean
  sort_order: number
}

export interface BannerApiResponse {
  status: string
  data: Banner | Banner[] | null
}
