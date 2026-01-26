'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react'
import SidebarLayout from '../../../../../components/layouts/SidebarLayout'
import type {EventItem, Ticket} from '@lib/types'
import {cn, getEndpoint, getErrorMessage} from '@lib/utils'
import EventDetails from '../../../../../components/events/EventDetails'
import {PhotoIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline'
import {categories as mockCategories} from '@lib/mockEvents'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css';
import Select from "../../../../../components/Select";
import Input from "../../../../../components/Input";
import HTTP from "@lib/HTTP";
import {errorToast, successToast} from "@components/Toast";

const ReactQuill = dynamic(() => import('react-quill-new'), {ssr: false})

type StepKey = 1 | 2 | 3 | 4

type EventType = 'physical' | 'virtual'

type DraftTicket = {
    id: string
    name: string
    description?: string
    price: number
    currency: 'NGN' | 'USD'
    start_selling_date: string
    end_selling_date: string
    quantity: number
}

type DraftEvent = {
    title: string
    description: string
    category: string
    tags: string[]
    image: string
    type: EventType
    eventLink: string
    undisclosed?: boolean

    date: string
    time: string
    timezone: string
    location: string

    tickets: DraftTicket[]
}

function GlassCard({children, className}: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'rounded-2xl bg-white/10 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-sm shadow-sm',
                className ?? ''
            )}
        >
            {children}
        </div>
    )
}

function SectionTitle({title, subtitle}: { title: string; subtitle?: string }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle ?
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{subtitle}</p> : null}
        </div>
    )
}

function TextArea({label, ...props}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
    return (
        <label className="block">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
            <textarea
                {...props}
                className={cn(
                    'mt-1 w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow',
                    props.className ?? ''
                )}
            />
        </label>
    )
}

function TagInput({tags, onChange}: { tags: string[]; onChange: (tags: string[]) => void }) {
    const [value, setValue] = useState('')

    function addTag(raw: string) {
        const t = raw.trim().replace(/^#/, '')
        if (!t) return
        const normalized = t.toLowerCase()
        if (tags.map((x) => x.toLowerCase()).includes(normalized)) return
        onChange([...tags, t])
    }

    return (
        <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Tags</div>
            <div className="mt-1 flex flex-wrap gap-2">
                {tags.map((t) => (
                    <button
                        type="button"
                        key={t}
                        onClick={() => onChange(tags.filter((x) => x !== t))}
                        className="text-xs px-3 py-1 rounded-full bg-white/30 dark:bg-black/30 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white"
                        title="Remove tag"
                    >
                        #{t}
                    </button>
                ))}
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            addTag(value)
                            setValue('')
                        }
                    }}
                    placeholder="Add tag and press Enter"
                    className="w-full rounded-xl bg-white/60 dark:bg-slate-900/50 border border-black/10 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
                <button
                    type="button"
                    onClick={() => {
                        addTag(value)
                        setValue('')
                    }}
                    className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                >
                    Add
                </button>
            </div>
        </div>
    )
}

function formatLocalDateTimeForInput(d: Date) {
    // yyyy-MM-ddTHH:mm
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toIsoDateFromLocalDateTime(local: string) {
    // Accepts 'yyyy-MM-ddTHH:mm' and returns 'yyyy-MM-dd'
    // (EventItem uses date/time separate; this is just for default convenience)
    return local?.slice(0, 10) ?? ''
}

function randomId(prefix: string) {
    return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`
}

const STORAGE_KEY = 'tbm:create-event:draft:v1'
const PLACEHOLDER_BANNER = '/images/placeholder-event.svg'

function sanitizeLoadedDraft(d: any, fallback: DraftEvent): DraftEvent {
    if (!d || typeof d !== 'object') return fallback

    const safeTickets: DraftTicket[] = Array.isArray(d.tickets)
        ? d.tickets.map((t: any) => ({
            id: typeof t?.id === 'string' ? t.id : randomId('t'),
            name: typeof t?.name === 'string' ? t.name : '',
            description: typeof t?.description === 'string' ? t.description : '',
            price: Number.isFinite(t?.price) ? Number(t.price) : 0,
            currency: (t?.currency === 'USD' ? 'USD' : 'NGN') as 'NGN' | 'USD',
            start_selling_date: typeof t?.start_selling_date === 'string' ? t.start_selling_date : fallback.tickets[0]?.start_selling_date,
            end_selling_date: typeof t?.end_selling_date === 'string' ? t.end_selling_date : fallback.tickets[0]?.end_selling_date,
            quantity: Number.isFinite(t?.quantity) ? Number(t.quantity) : 0,
        }))
        : fallback.tickets

    return {
        title: typeof d.title === 'string' ? d.title : fallback.title,
        description: typeof d.description === 'string' ? d.description : fallback.description,
        category: typeof d.category === 'string' ? d.category : fallback.category,
        tags: Array.isArray(d.tags) ? d.tags.filter((x: any) => typeof x === 'string') : fallback.tags,
        image: typeof d.image === 'string' ? d.image : fallback.image,
        type: d.type === 'virtual' ? 'virtual' : 'physical',
        eventLink: typeof d.eventLink === 'string' ? d.eventLink : fallback.eventLink,

        date: typeof d.date === 'string' ? d.date : fallback.date,
        time: typeof d.time === 'string' ? d.time : fallback.time,
        timezone: typeof d.timezone === 'string' ? d.timezone : fallback.timezone,
        location: typeof d.location === 'string' ? d.location : fallback.location,

        tickets: safeTickets.length > 0 ? safeTickets : fallback.tickets,
    }
}

export default function CreateEventPage() {
    const now = new Date()
    const later = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const defaultDraft: DraftEvent = useMemo(
        () => ({
            title: '',
            description: '',
            category: 'Tech',
            tags: [],
            image: '',
            type: 'physical',
            eventLink: '',
            undisclosed: false,

            date: later.toISOString().slice(0, 10),
            time: '18:00',
            timezone: 'Africa/Lagos',
            location: '',

            tickets: [
                {
                    id: randomId('t'),
                    name: 'General Admission',
                    description: '',
                    price: 0,
                    currency: 'NGN',
                    start_selling_date: formatLocalDateTimeForInput(now),
                    end_selling_date: formatLocalDateTimeForInput(later),
                    quantity: 0,
                },
            ],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const [step, setStep] = useState<StepKey>(1)
    const [draft, setDraft] = useState<DraftEvent>(defaultDraft)

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [uploadedObjectUrl, setUploadedObjectUrl] = useState<string | null>(null)

    // cleanup uploaded preview URL
    useEffect(() => {
        return () => {
            if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)
        }
    }, [uploadedObjectUrl])

    function setDraftImage(next: string) {
        setDraft((d) => ({...d, image: next}))
    }

    function clearSelectedImage() {
        if (uploadedObjectUrl) {
            URL.revokeObjectURL(uploadedObjectUrl)
            setUploadedObjectUrl(null)
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
        setDraftImage('')
    }

    // Restore from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return
            const parsed = JSON.parse(raw)

            const loadedStep = parsed?.step
            if (loadedStep === 1 || loadedStep === 2 || loadedStep === 3 || loadedStep === 4) setStep(loadedStep)

            const loadedDraft = sanitizeLoadedDraft(parsed?.draft, defaultDraft)
            setDraft(loadedDraft)
        } catch {
        }
    }, [defaultDraft])

    // Persist to localStorage (light debounce)
    useEffect(() => {
        const t = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({step, draft}))
            } catch {
                // ignore
            }
        }, 250)

        return () => clearTimeout(t)
    }, [draft, step])

    const categories = useMemo(() => (mockCategories ?? []).filter((c) => c !== 'All'), [])

    const previewEvent: EventItem = useMemo(() => {
        const location =
            draft.type === 'virtual'
                ? draft.eventLink
                    ? `Online • ${draft.eventLink}`
                    : 'Online'
                : [draft.location].filter(Boolean).join(' • ') || 'TBA'

        const tickets: Ticket[] = draft.tickets
            .filter((t) => t.name.trim().length > 0)
            .map((t) => ({
                id: t.id,
                name: t.name,
                description: t.description?.trim() ? t.description : undefined,
                price: Number.isFinite(t.price) ? t.price : 0,
                currency: t.currency,
                start_selling_date: toIsoDateFromLocalDateTime(t.start_selling_date),
                end_selling_date: toIsoDateFromLocalDateTime(t.end_selling_date),
                quantity: Number.isFinite(t.quantity) ? t.quantity : 0,
            }))

        return {
            id: 'preview',
            title: draft.title || 'Untitled event',
            description: draft.description || 'Add a description…',
            date: draft.date,
            time: draft.time,
            location,
            category: draft.category,
            image: draft.image?.trim() ? draft.image : PLACEHOLDER_BANNER,
            tags: draft.tags,
            isOnline: draft.type === 'virtual',
            tickets,
        }
    }, [draft])

    const steps = [
        {key: 1 as const, label: 'Basic Info'},
        {key: 2 as const, label: 'Date & Location'},
        {key: 3 as const, label: 'Tickets'},
        {key: 4 as const, label: 'Preview'},
    ]

    function canGoNext(current: StepKey) {
        if (current === 1) {
            if (!draft.title.trim()) return false

            if (!draft.category.trim()) return false

            if (!draft.image.trim()) return false

            return !(draft.type === 'virtual' && !draft.eventLink.trim());
        }

        if (current === 2) {
            if (!draft.date) return false

            if (!draft.time) return false

            if (!draft.timezone.trim()) return false

            return !(draft.type === 'physical' && !draft.location.trim());
        }

        if (current === 3) {
            const hasValidTicket = draft.tickets.some((t) => t.name.trim())

            if (!hasValidTicket) return false

            const invalid = draft.tickets.some((t) => {
                if (!t.name.trim()) return true

                if (t.price < 0) return true

                if (t.quantity < 0) return true

                if (!t.start_selling_date) return true

                if (!t.end_selling_date) return true

                return new Date(t.start_selling_date).getTime() > new Date(t.end_selling_date).getTime();
            })
            return !invalid
        }
        return true
    }

    const [uploading, setUploading] = useState<boolean>(false)

    async function publishEvent() {
        const formData = new FormData();

        formData.append('title', draft.title);
        formData.append('description', draft.description)
        formData.append('category', draft.category)
        formData.append('type', draft.type)

        draft.tags.forEach(tag => formData.append('tags[]', tag));

        formData.append('date', draft.date)
        formData.append('time', draft.time)
        formData.append('timezone', draft.timezone)

        draft.type === 'physical' && formData.append('location', draft.location)
        draft.type === 'virtual' && formData.append('virtual_link', draft.eventLink)

        draft.tickets.forEach((ticket, index) => {
            formData.append(`tickets[${index}][id]`, ticket.id)
            formData.append(`tickets[${index}][name]`, ticket.name)
            formData.append(`tickets[${index}][description]`, ticket.description ?? '')
            formData.append(`tickets[${index}][price]`, ticket.price.toString())
            formData.append(`tickets[${index}][currency]`, ticket.currency)
            formData.append(`tickets[${index}][start_selling_date]`, ticket.start_selling_date)
            formData.append(`tickets[${index}][end_selling_date]`, ticket.end_selling_date)
            formData.append(`tickets[${index}][quantity]`, ticket.quantity.toString())
        })

        formData.append('undisclosed', (draft.undisclosed ? '1' : '0'))


        if (uploadedObjectUrl) {
            formData.append('image', await (await fetch(uploadedObjectUrl)).blob())
        } else if (draft.image.startsWith('blob')) {
            clearSelectedImage()
            setStep(1)
            errorToast("Please select/upload your image again")
            return
        } else {
            formData.append('image_url', draft.image)
        }

        setUploading(true)

        const response = await HTTP({
            url: getEndpoint("/dashboard/organizer/event"),
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        })

        if (!response.ok) {
            errorToast(getErrorMessage(response.error))
            return
        }

        // Clear draft on successful publish
        localStorage.removeItem(STORAGE_KEY)
        successToast('Event Created Successfully!')
        setStep(1)
        setDraft(defaultDraft)
    }

    return (
        <SidebarLayout>
            <div className="w-full max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Event</h1>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">An easy multi-step form to
                        publish a beautiful event page.</p>
                </div>

                {/* Stepper */}
                <div className="mt-6">
                    <GlassCard className="p-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {steps.map((s) => {
                                const active = step === s.key
                                const done = step > s.key
                                return (
                                    <button
                                        key={s.key}
                                        type="button"
                                        onClick={() => {
                                            // allow navigating backwards always; forward only if previous step is valid
                                            if (s.key < step) setStep(s.key)
                                            else if (s.key === step) return
                                            else if (canGoNext((s.key - 1) as StepKey)) setStep(s.key)
                                        }}
                                        className={cn(
                                            'px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2',
                                            active
                                                ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
                                                : 'text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/5'
                                        )}
                                    >
                    <span
                        className={cn(
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                            done ? 'bg-emerald-100 text-emerald-800' : active ? 'bg-brand-yellow text-white' : 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
                        )}
                    >
                      {s.key}
                    </span>
                                        {s.label}
                                    </button>
                                )
                            })}
                        </div>
                    </GlassCard>
                </div>

                {/* Step content */}
                <div className="mt-6">
                    {step === 1 ? (
                        <GlassCard className="p-6">
                            <SectionTitle title="Basic info" subtitle="Tell people what your event is about."/>

                            <div className="mt-6 grid grid-cols-1 gap-6">
                                <Input
                                    label="Event title"
                                    value={draft.title}
                                    onChange={(e) => setDraft((d) => ({...d, title: e.target.value}))}
                                    placeholder="e.g. Synthwave Night: Neon Beats"
                                />

                                <div>
                                    <div
                                        className="block text-sm font-semibold text-gray-900 dark:text-white">Description
                                    </div>
                                    <div className="mt-1">
                                        <ReactQuill
                                            theme="snow"
                                            value={draft.description}
                                            onChange={(value) => setDraft((d) => ({...d, description: value}))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select
                                        label="Category"
                                        value={draft.category}
                                        onChange={(e) => setDraft((d) => ({...d, category: e.target.value}))}
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </Select>

                                    <Select
                                        label="Type"
                                        value={draft.type}
                                        onChange={(e) => setDraft((d) => ({...d, type: e.target.value as EventType}))}
                                    >
                                        <option value="physical">Physical</option>
                                        <option value="virtual">Virtual</option>
                                    </Select>
                                </div>

                                {draft.type === 'virtual' ? (
                                    <Input
                                        label="Event link"
                                        value={draft.eventLink}
                                        onChange={(e) => setDraft((d) => ({...d, eventLink: e.target.value}))}
                                        placeholder="https://meet.google.com/..."
                                    />
                                ) : null}

                                <TagInput tags={draft.tags} onChange={(tags) => setDraft((d) => ({...d, tags}))}/>

                                <div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Event banner
                                        image
                                    </div>

                                    <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Preview */}
                                        <div
                                            className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/5 dark:bg-white/5">
                                            {draft.image?.trim() ? (
                                                <div className="relative">
                                                    <img
                                                        src={draft.image}
                                                        alt="Selected event banner"
                                                        className="w-full h-[16.5rem] object-cover"
                                                    />
                                                    <div
                                                        className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                                        <div
                                                            className="text-sm font-semibold text-white truncate">{draft.title || 'Event banner preview'}</div>
                                                        <div className="text-xs text-white/80">Recommended: 1600×900
                                                            (16:9)
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-56 flex items-center justify-center p-6">
                                                    <div
                                                        className="w-full h-full rounded-xl border border-dashed border-black/20 dark:border-white/20 bg-white/30 dark:bg-black/20 flex flex-col items-center justify-center text-center">
                                                        <PhotoIcon
                                                            className="w-10 h-10 text-text-muted-light dark:text-text-muted-dark"/>
                                                        <div
                                                            className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No
                                                            image selected
                                                        </div>
                                                        <div
                                                            className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                            Upload a banner or paste an image URL.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Controls */}
                                        <div
                                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/5 p-4">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">Choose
                                                image
                                            </div>
                                            <div
                                                className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                We store the chosen image URL in the draft.
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                                                >
                                                    <PhotoIcon className="w-4 h-4"/>
                                                    Upload image
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setDraftImage(PLACEHOLDER_BANNER)}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                                                >
                                                    Use placeholder
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={clearSelectedImage}
                                                    className={cn(
                                                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold',
                                                        draft.image?.trim()
                                                            ? 'bg-rose-600 text-white hover:bg-rose-700'
                                                            : 'opacity-40 cursor-not-allowed bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white'
                                                    )}
                                                    disabled={!draft.image?.trim()}
                                                >
                                                    <TrashIcon className="w-4 h-4"/>
                                                    Clear
                                                </button>

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (!file) return

                                                        // revoke old object URL
                                                        if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl)

                                                        const url = URL.createObjectURL(file)
                                                        setUploadedObjectUrl(url)
                                                        setDraftImage(url)
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <Input
                                                    label="Image URL"
                                                    value={draft.image}
                                                    onChange={(e) => {
                                                        const next = e.target.value
                                                        // if user switches away from uploaded image, release the object URL
                                                        if (uploadedObjectUrl && next !== uploadedObjectUrl) {
                                                            URL.revokeObjectURL(uploadedObjectUrl)
                                                            setUploadedObjectUrl(null)
                                                        }
                                                        setDraftImage(next)
                                                    }}
                                                    placeholder="https://..."
                                                />
                                                <div
                                                    className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                                                    Tip: You can paste a direct image link, use the placeholder or upload an image.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ) : null}

                    {step === 2 ? (
                        <GlassCard className="p-6">
                            <SectionTitle title="Date & location" subtitle="Set when and where the event happens."/>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <Input
                                    label="Date"
                                    type="date"
                                    value={draft.date}
                                    onChange={(e) => setDraft((d) => ({...d, date: e.target.value}))}
                                />

                                <Input
                                    label="Time"
                                    value={draft.time}
                                    onChange={(e) => setDraft((d) => ({...d, time: e.target.value}))}
                                    placeholder="e.g. 19:00"
                                />

                                <Input
                                    label="Timezone"
                                    value={draft.timezone}
                                    onChange={(e) => setDraft((d) => ({...d, timezone: e.target.value}))}
                                    placeholder="Africa/Lagos"
                                />

                                {draft.type === 'physical' && (
                                    <>
                                        <div>
                                            <Input
                                                label="Venue/Location"
                                                value={draft.location}
                                                onChange={(e) => setDraft((d) => ({...d, location: e.target.value}))}
                                                placeholder="Street, City, State"
                                            />
                                            <label
                                                className="mt-3 inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <input type="checkbox" checked={draft.undisclosed ?? false} onChange={(e) => setDraft((prev) => ({...prev, undisclosed: e.target.checked}))}/>
                                                <span className="text-xs">Disclose only to attendees</span>
                                            </label>
                                        </div>

                                        {/*<div className="sm:col-span-2">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">Map
                                                preview (optional)
                                            </div>
                                            <div
                                                className="mt-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                                                <div
                                                    className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                                    Map preview placeholder. Later we can embed Google Maps using the
                                                    address.
                                                </div>
                                                <div
                                                    className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                    {draft.venueName || 'Venue'}
                                                </div>
                                                <div
                                                    className="text-sm text-text-muted-light dark:text-text-muted-dark">{draft.address || 'Address'}</div>
                                            </div>
                                        </div>*/}
                                    </>
                                )}
                            </div>
                        </GlassCard>
                    ) : null}

                    {step === 3 ? (
                        <GlassCard className="p-6">
                            <SectionTitle title="Tickets" subtitle="Create one or more ticket types."/>

                            <div className="mt-6 space-y-8">
                                {draft.tickets.map((t, idx) => (
                                    <div key={t.id}
                                         className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">Ticket
                                                    #{idx + 1}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (draft.tickets.length === 1) return
                                                    setDraft((d) => ({
                                                        ...d,
                                                        tickets: d.tickets.filter((x) => x.id !== t.id)
                                                    }))
                                                }}
                                                className={cn(
                                                    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                                                    draft.tickets.length === 1
                                                        ? 'opacity-40 cursor-not-allowed bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10'
                                                        : 'bg-rose-600 text-white hover:bg-rose-700'
                                                )}
                                                disabled={draft.tickets.length === 1}
                                                title={draft.tickets.length === 1 ? 'At least one ticket is required' : 'Remove ticket'}
                                            >
                                                <TrashIcon className="w-4 h-4"/>
                                                Remove
                                            </button>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <Input
                                                label="Name"
                                                value={t.name}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        name: e.target.value
                                                    } : x)),
                                                }))}
                                                placeholder="e.g. VIP"
                                            />

                                            <Select
                                                label="Currency"
                                                value={t.currency}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        currency: e.target.value as 'NGN' | 'USD'
                                                    } : x)),
                                                }))}
                                            >
                                                <option value="NGN">NGN</option>
                                                <option value="USD">USD</option>
                                            </Select>

                                            <div className="sm:col-span-2">
                                                <TextArea
                                                    label="Description (optional)"
                                                    value={t.description ?? ''}
                                                    onChange={(e) => setDraft((d) => ({
                                                        ...d,
                                                        tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                            ...x,
                                                            description: e.target.value
                                                        } : x)),
                                                    }))}
                                                    rows={3}
                                                    placeholder="What does this ticket include?"
                                                />
                                            </div>

                                            <Input
                                                label="Price"
                                                type="number"
                                                min={0}
                                                value={String(t.price)}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        price: Number(e.target.value)
                                                    } : x)),
                                                }))}
                                                note="0 = free"
                                            />

                                            <Input
                                                label="Quantity"
                                                type="number"
                                                min={0}
                                                value={String(t.quantity)}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        quantity: Number(e.target.value)
                                                    } : x)),
                                                }))}
                                                note="0 = unlimited"
                                            />

                                            <Input
                                                label="Start selling date"
                                                type="datetime-local"
                                                value={t.start_selling_date}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        start_selling_date: e.target.value
                                                    } : x)),
                                                }))}
                                            />

                                            <Input
                                                label="End selling date"
                                                type="datetime-local"
                                                value={t.end_selling_date}
                                                onChange={(e) => setDraft((d) => ({
                                                    ...d,
                                                    tickets: d.tickets.map((x) => (x.id === t.id ? {
                                                        ...x,
                                                        end_selling_date: e.target.value
                                                    } : x)),
                                                }))}
                                            />
                                        </div>

                                        {/* Inline validation */}
                                        <div className="mt-3 text-xs text-text-muted-light dark:text-text-muted-dark">
                                            {(!t.name.trim()) ? '• Ticket name is required.' : null}
                                            {(t.price < 0) ? ' • Price cannot be negative.' : null}
                                            {(t.quantity < 0) ? ' • Quantity cannot be negative.' : null}
                                            {(t.start_selling_date && t.end_selling_date && new Date(t.start_selling_date).getTime() > new Date(t.end_selling_date).getTime())
                                                ? ' • Start selling date must be before end selling date.'
                                                : null}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setDraft((d) => ({
                                        ...d,
                                        tickets: [
                                            ...d.tickets,
                                            {
                                                id: randomId('t'),
                                                name: '',
                                                description: '',
                                                price: 0,
                                                currency: 'NGN',
                                                start_selling_date: formatLocalDateTimeForInput(now),
                                                end_selling_date: formatLocalDateTimeForInput(later),
                                                quantity: 0,
                                            },
                                        ],
                                    }))}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                                >
                                    <PlusIcon className="w-4 h-4"/>
                                    Add ticket type
                                </button>
                            </div>
                        </GlassCard>
                    ) : null}

                    {step === 4 ? (
                        <div className="space-y-4">
                            <GlassCard className="p-6">
                                <SectionTitle title="Preview" subtitle="This is how your event page will look."/>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Clear saved draft?')) {
                                                try {
                                                    localStorage.removeItem(STORAGE_KEY)
                                                } catch {
                                                    // ignore
                                                }
                                                setDraft(defaultDraft)
                                                setStep(1)
                                            }
                                        }}
                                        className="rounded-xl bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/20"
                                    >
                                        Reset draft
                                    </button>
                                </div>

                                <div className="mt-4 rounded-2xl overflow-hidden pointer-events-none">
                                    <EventDetails event={previewEvent}/>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <SectionTitle title="Publish"/>

                                <div
                                    className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                        Make sure the preview looks correct. When you’re ready, click Publish.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={publishEvent}
                                        className="rounded-xl bg-brand-yellow px-5 py-3 text-sm font-bold text-white hover:opacity-95"
                                        disabled={uploading}
                                    >
                                        { uploading ? 'Publishing...' : 'Publish Event' }
                                    </button>
                                </div>
                            </GlassCard>
                        </div>
                    ) : null}
                </div>

                {/* Footer nav */}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setStep((s) => (Math.max(1, s - 1) as StepKey))}
                        disabled={step === 1}
                        className={cn(
                            'rounded-xl px-4 py-2 text-sm font-semibold border',
                            step === 1
                                ? 'opacity-40 cursor-not-allowed bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white'
                                : 'bg-white/10 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                        )}
                    >
                        Back
                    </button>

                    <div className="flex items-center gap-2">
                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!canGoNext(step)) return
                                    setStep((s) => (Math.min(4, s + 1) as StepKey))
                                }}
                                className={cn(
                                    'rounded-xl px-4 py-2 text-sm font-bold text-white',
                                    canGoNext(step) ? 'bg-brand-teal hover:opacity-95' : 'bg-white/20 text-white/70 cursor-not-allowed'
                                )}
                                disabled={!canGoNext(step)}
                            >
                                Next
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    )
}
