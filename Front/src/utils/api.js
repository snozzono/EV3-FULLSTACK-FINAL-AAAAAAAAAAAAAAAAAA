export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`
  return url
}