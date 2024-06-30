import { TicketFormType, TicketSchema } from "./eventSchema"

export const filterValidTickets = (tickets: TicketFormType[]) => {
  return tickets?.filter((t) => TicketSchema.safeParse(t).success)
}
