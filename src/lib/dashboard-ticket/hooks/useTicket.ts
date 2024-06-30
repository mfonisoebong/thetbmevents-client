import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getPurchasedTicket } from "@lib/dashboard-ticket/helpers/getPurchasedTicket";

export default function useTicket() {
  const { query } = useRouter();
  const ticketId = query?.id as string;
  const fetcher = () => getPurchasedTicket(ticketId);
  const ticket = useQuery(["ticket", ticketId], fetcher);

  return ticket;
}
