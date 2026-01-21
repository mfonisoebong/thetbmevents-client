export type Organizer = {
  id: string
  businessName: string
  email: string
  phone: string
  createdAt: string
  isActive: boolean
}

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const BUSINESS = ['Aurora Events', 'Kite Studio', 'The TBM Group', 'PalmHouse', 'Cedar Collective', 'Moonlight Co.']
const DOMAINS = ['example.com', 'tbm.events', 'events.test', 'mail.com']

export function makeMockOrganizers(count = 18): Organizer[] {
  return Array.from({ length: count }).map((_, i) => {
    const seed = hashStringToNumber(`org:${i}`)
    const name = BUSINESS[seed % BUSINESS.length] ?? `Organizer ${i + 1}`
    const domain = DOMAINS[(seed >> 3) % DOMAINS.length] ?? 'example.com'
    const email = `${name.replace(/\s+/g, '.').toLowerCase()}${(seed % 9) ? '' : `.${seed % 97}`}@${domain}`
    const phone = `+234 80${(seed % 9) + 1} ${(seed % 900) + 100} ${(seed % 9000) + 1000}`
    const createdAt = new Date(Date.now() - ((seed % 180) + 10) * 24 * 60 * 60 * 1000).toISOString()
    const isActive = (seed % 5) !== 0

    return {
      id: `org_${i + 1}`,
      businessName: name,
      email,
      phone,
      createdAt,
      isActive,
    }
  })
}
