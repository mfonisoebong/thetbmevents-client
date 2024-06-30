export function currencyFormatter(currency: string, num: number) {
  const format = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency,
  }).format(num)
  return format
}
