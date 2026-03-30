import type { Metadata } from 'next';
import { headers as getRequestHeaders } from 'next/headers'
import type { ReactElement } from 'react'
import EventDetails from '../../../../components/events/EventDetails'
import { stripHtml } from '@lib/utils'
import { getEvent } from '@lib/getEvent'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params

  if (!id) {
    return <EventNotFound />
  }

  const event = await getEvent(id)

  if (!event) {
    return <EventNotFound />
  }

  return <EventDetails event={event} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  const event = id ? await getEvent(id) : null
  const baseUrl = await getBaseUrl()

  if (!event) {
    return {
      title: 'Event not found',
      description: "We couldn't find that event.",
      openGraph: {
        title: 'Event not found',
        description: "We couldn't find that event.",
      },
      twitter: {
        card: 'summary',
        title: 'Event not found',
        description: "We couldn't find that event.",
      },
    }
  }

  const rawDescription = stripHtml(event.description)
  const description = rawDescription
    ? sanitizeMetadataDescription(rawDescription)
    : 'View details and book tickets for the selected event.'
  const pageUrl = buildAbsoluteUrl(`/events/${event.id}`, baseUrl)
  const imageUrl = resolveImageUrl(event.image, baseUrl)

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: 'website',
      url: pageUrl,
      images: imageUrl ? [{ url: imageUrl, alt: event.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: event.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

async function getBaseUrl(): Promise<string | null> {
  try {
    const incoming = await getRequestHeaders()
    const host = incoming.get('x-forwarded-host') || incoming.get('host')

    if (!host) return null

    const protocol = incoming.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    return `${protocol}://${host}`
  } catch {
    return null
  }
}

function buildAbsoluteUrl(value: string, baseUrl: string | null): string {
  if (/^https?:\/\//i.test(value) || !baseUrl) return value

  return `${baseUrl}${value.startsWith('/') ? value : `/${value}`}`
}

function resolveImageUrl(image: string | undefined, baseUrl: string | null): string {
  const normalized = image?.trim() || '/images/placeholder-event.svg'
  return buildAbsoluteUrl(normalized, baseUrl)
}

function sanitizeMetadataDescription(input: string): string {
  return input
    .replace(/&amp;nbsp;/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function EventNotFound() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20">
      <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-semibold dark:text-white">Event not found</h3>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-2">We couldn&apos;t find that event.</p>
      </div>
    </div>
  )
}
