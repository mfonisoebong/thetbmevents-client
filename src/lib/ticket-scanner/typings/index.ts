export interface TicketMetaData {
  id: number
  event_id: string
  quantity: number
  price: number
}

export interface ScanResultMessageProps {
  status: "success" | "failed"
  msg: string
}

export interface ScanResultProps {
  close: () => void
  ticket: TicketMetaData | null
}
