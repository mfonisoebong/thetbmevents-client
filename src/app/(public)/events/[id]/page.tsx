import type { Metadata } from 'next';
import type { ReactElement } from 'react'
import EventDetails from '../../../../components/events/EventDetails'
import type { EventItem, ApiData } from '@lib/types'
import {stripHtml} from "@lib/utils";

type PageProps = {
  params: Promise<{ id: string }>
}

async function getEvent(id: string): Promise<EventItem | null> {
  const { getEndpoint } = await import('@lib/utils')

  type EventApiResponse = ApiData<EventItem>

  try {
    const res = await fetch(getEndpoint(`/events/${encodeURIComponent(id)}`), {
      method: 'GET',
      // Server component: let Next.js cache within a request; 0 = no caching.
      next: { revalidate: 0 },
    })

    if (!res.ok) return null

    const json = (await res.json()) as EventApiResponse

    const event = json?.data
    if (!event) return null

    return event
  } catch {
    return null
  }
}

export default async function EventPage({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params

  if (!id) {
    return <EventNotFound/>
  }

  const event = await getEvent(id)

  if (!event) {
    return <EventNotFound/>
  }

  return <EventDetails event={event} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  const event = id ? await getEvent(id) : null

  if (!event) {
    return {
      title: 'Event not found',
      description: "We couldn't find that event.",
    }
  }

  return {
    title: event.title,
    description: stripHtml(event.description) ?? 'View details and book tickets for the selected event.',
  }
}

function EventNotFound() {
  return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold dark:text-white">Event not found</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-2">We couldn&apos;t find that event.</p>
        </div>
      </div>
  );
}
