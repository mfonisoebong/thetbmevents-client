import { TicketMetaData } from "../typings"

export default function isValidTicket(data: any): data is TicketMetaData {
  return data?.id ? true : false
}
