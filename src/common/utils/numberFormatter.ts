export const numberFormatter = (num: number, digits?: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits ?? 2,
  }).format(num)
}
