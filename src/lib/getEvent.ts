import type { ApiData, EventItem } from './types'
import { getEndpoint } from './utils'

type EventApiResponse = ApiData<EventItem>

export async function getEvent(id: string): Promise<EventItem | null> {
  try {
    const res = await fetch(getEndpoint(`/events/${encodeURIComponent(id)}`), {
      method: 'GET',
      // Ensure fresh data for this request (and avoid build-time caching).
      cache: 'no-store',
    })

    if (!res.ok) return null

    const json = (await res.json()) as EventApiResponse
    return json?.data ?? null
  } catch {
    return null
  }
}
