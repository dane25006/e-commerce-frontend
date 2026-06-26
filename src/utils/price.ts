export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num % 1 === 0 ? `$${num.toFixed(0)}` : `$${num.toFixed(2)}`
}
