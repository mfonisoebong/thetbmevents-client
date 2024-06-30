import { TicketsContext } from "@lib/event-checkout/contexts/Tickets/Context";
import { useContext } from "react";

export default function useTicketsContext() {
  return useContext(TicketsContext);
}
