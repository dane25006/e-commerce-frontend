export function imageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // path already starts with /storage/... just prepend the host
  const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://127.0.0.1:8000'
  return `${BASE}${path}`
}