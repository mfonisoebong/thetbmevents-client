import { useQuery } from "@tanstack/react-query";
import { getPurchasedTickets } from "@lib/dashboard-tickets/helpers/getPurchasedTickets";

export default function usePurchasedTickets() {
  const tickets = useQuery(["purhcased_tickets"], getPurchasedTickets, {
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });
  return tickets;
}
