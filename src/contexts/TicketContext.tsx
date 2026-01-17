"use client"

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface AttendeeInfo {
  fullname: string
  email: string
  phone?: string
  // if true, use purchaser contact info
  sendToMe?: boolean
}

interface CustomerInfo {
  fullname: string
  email: string
  phone?: string
}

interface TicketInstance {
  id: string
  name?: string
  price?: number
  currency?: string
}

interface TicketContextValue {
  // selected quantities per ticket id
  selectedQuantities: Record<string, number>
  setSelectedQuantities: (s: Record<string, number>) => void
  // ticket metadata (id -> name/price/currency)
  ticketMeta: Record<string, { name?: string; price?: number; currency?: string }>
  setTicketMeta: (m: Record<string, { name?: string; price?: number; currency?: string }>) => void
  // flat list of ticket instances (one item per seat/ticket)
  ticketInstances: TicketInstance[]
  // purchaser contact
  customer: CustomerInfo
  setCustomer: (c: CustomerInfo) => void
  // attendees information corresponding to ticketInstances
  attendees: AttendeeInfo[]
  setAttendees: (a: AttendeeInfo[]) => void
  // clear stored context
  clearContext: () => void
}

const TicketContext = createContext<TicketContextValue | undefined>(undefined)

const STORAGE_KEY = 'tbm_ticket_context_v1'

export function useTicketContext() {
  const ctx = useContext(TicketContext)
  if (!ctx) throw new Error('useTicketContext must be used within TicketProvider')
  return ctx
}

export function TicketProvider({ children }: { children: ReactNode }) {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})
  const [ticketMeta, setTicketMeta] = useState<Record<string, { name?: string; price?: number; currency?: string }>>({})
  const [customer, setCustomer] = useState<CustomerInfo>({ fullname: '', email: '', phone: '' })
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([])

  // load persisted state from sessionStorage once on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed.selectedQuantities) setSelectedQuantities(parsed.selectedQuantities)
      if (parsed.ticketMeta) setTicketMeta(parsed.ticketMeta)
      if (parsed.customer) setCustomer(parsed.customer)
      if (parsed.attendees) setAttendees(parsed.attendees)
    } catch (err) {
      // ignore parse errors
      console.warn('Failed to load ticket context from sessionStorage', err)
    }
  }, [])

  // persist to sessionStorage whenever relevant state changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({ selectedQuantities, ticketMeta, customer, attendees })
      sessionStorage.setItem(STORAGE_KEY, payload)
    } catch (err) {
      console.warn('Failed to persist ticket context to sessionStorage', err)
    }
  }, [selectedQuantities, ticketMeta, customer, attendees])

  // derive ticketInstances from selectedQuantities and ticketMeta
  const ticketInstances: TicketInstance[] = useMemo(() => {
    const list: TicketInstance[] = []
    Object.entries(selectedQuantities).forEach(([id, qty]) => {
      const meta = ticketMeta[id] ?? {}
      for (let i = 0; i < qty; i++) {
        list.push({ id, name: meta.name, price: meta.price, currency: meta.currency })
      }
    })
    return list
  }, [selectedQuantities, ticketMeta])

  function clearContext() {
    setSelectedQuantities({})
    setTicketMeta({})
    setCustomer({ fullname: '', email: '', phone: '' })
    setAttendees([])
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const value: TicketContextValue = {
    selectedQuantities,
    setSelectedQuantities,
    ticketMeta,
    setTicketMeta,
    ticketInstances,
    customer,
    setCustomer,
    attendees,
    setAttendees,
    clearContext,
  }

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}
