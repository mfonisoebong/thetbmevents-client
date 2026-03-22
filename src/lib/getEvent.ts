import type { ApiData, EventItem } from './types'
import { headers as getRequestHeaders } from 'next/headers'
import { getEndpoint } from './utils'

type EventApiResponse = ApiData<EventItem>

async function getForwardedHeaders(): Promise<Record<string, string>> {
  try {
    const incoming = await getRequestHeaders()
    const userAgent = incoming.get('user-agent')
    const forwardedFor = incoming.get('x-forwarded-for')
    const firstForwardedIp = forwardedFor?.split(',')[0]
    const realIp = incoming.get('x-real-ip')

    return {
      'User-Agent': userAgent || 'TBMEventsClient/unknown',
      'X-user-ip': firstForwardedIp || realIp || '',
    }
  } catch {
    return {
      'User-Agent': 'TBMEventsClient/unknown',
      'X-user-ip': '',
    }
  }
}

export async function getEvent(id: string): Promise<EventItem | null> {
  try {
    const forwardedHeaders = await getForwardedHeaders()

    const res = await fetch(getEndpoint(`/events/${encodeURIComponent(id)}`), {
      method: 'GET',
      // Ensure fresh data for this request (and avoid build-time caching).
      cache: 'no-store',
      headers: forwardedHeaders,
    })

    if (!res.ok) return null

    const json = (await res.json()) as EventApiResponse
    return json?.data ?? null
  } catch {
    return null
  }
}
