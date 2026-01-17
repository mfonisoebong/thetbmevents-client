const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const day = String(d.getDate()).padStart(2, '0')
    const month = months[d.getMonth()] || ''
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
}

const currencySymbol = (code?: string) => {
  if (!code) return ''
  const map: Record<string, string> = {
    NGN: '₦',
    USD: '$',
  }
  return map[code.toUpperCase()] ?? code
}

export { formatDate, currencySymbol };
