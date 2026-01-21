export type AdminAttendeeRow = {
  id: string
  name: string
  email: string
  event: string
  ticketPurchased: string
  totalSpent: number
}

const FIRST = ['Amina', 'Chinedu', 'Zara', 'Daniel', 'Fatima', 'Kofi', 'Rachel', 'Tobi', 'Lilian', 'Musa', 'Ada', 'Brian']
const LAST = ['Okafor', 'Mensah', 'Adeyemi', 'Johnson', 'Abubakar', 'Onyeka', 'Ibrahim', 'Okeke', 'Brown', 'Nguyen']
const EVENT = ['Design Meetup', 'Startup Pitch Night', 'Wellness Yoga', 'Poetry Slam', 'Synth Session', 'Community Hangout']
const TICKET = ['Regular', 'VIP', 'Early Bird', 'Group']

function hashStringToNumber(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function makeMockAttendees(count = 40): AdminAttendeeRow[] {
  return Array.from({ length: count }).map((_, i) => {
    const seed = hashStringToNumber(`att:${i}`)
    const first = FIRST[seed % FIRST.length] ?? `Attendee`
    const last = LAST[(seed >> 3) % LAST.length] ?? `${i + 1}`
    const name = `${first} ${last}`

    const email = `${first.toLowerCase()}.${last.toLowerCase()}${seed % 9 ? '' : `.${seed % 97}`}@mail.com`

    const event = EVENT[(seed >> 2) % EVENT.length] ?? 'Event'
    const ticketPurchased = TICKET[(seed >> 5) % TICKET.length] ?? 'Regular'

    const totalSpent = Math.round(((seed % 50000) + 2500) / 10) * 10

    return {
      id: `att_${i + 1}`,
      name,
      email,
      event,
      ticketPurchased,
      totalSpent,
    }
  })
}
