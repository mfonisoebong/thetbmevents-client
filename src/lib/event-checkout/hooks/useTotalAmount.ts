import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import useEvent from "@lib/event/hooks/useEvent";

export default function useTotalAmount() {
  const { selectedTickets } = useTicketsContext();
  const { data: eventsData } = useEvent();
  const selectedTicketsIds = selectedTickets.map((ticket) => ticket.id);
  const tickets =
    eventsData?.tickets.filter((ticket) =>
      selectedTicketsIds.includes(ticket.id),
    ) ?? [];

  const amounts = tickets.map((ticket) => {
    const ticketQuantity =
      selectedTickets.find((selectedTicket) => selectedTicket.id === ticket.id)
        ?.quantity ?? 0;
    return ticketQuantity * ticket.price;
  });

  const totalAmount = amounts.reduce((a, b) => a + b, 0);

  return { totalAmount };
}
