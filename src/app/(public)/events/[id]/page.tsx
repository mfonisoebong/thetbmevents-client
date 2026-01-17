import type { ReactElement } from 'react'
import EventDetails from '../../../../components/events/EventDetails'
import { events as mockEvents } from '../../../../lib/mockEvents'
import type { EventItem } from '../../../../types'

// Use a permissive params type to avoid Next's generated PageProps type mismatch
type Props = {
  params: any
}

export default function EventPage({ params }: Props): ReactElement {
  const event: EventItem | undefined = mockEvents.find((e) => e.id === params.id)

  if (!event) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold dark:text-white">Event not found</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mt-2">We couldn&apos;t find that event.</p>
        </div>
      </div>
    )
  }

  return <EventDetails event={event} />
}
