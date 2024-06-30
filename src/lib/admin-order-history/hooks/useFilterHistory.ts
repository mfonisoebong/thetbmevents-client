import useOrderHistory from "@lib/admin-order-history/hooks/useOrderHistory";
import { useSearchParams } from "next/navigation";

export default function useFilterHistory() {
  const { data: orders } = useOrderHistory();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const filteredOrders = search
    ? orders?.data.filter((order) => {
        const eventName = order.event_name.toLowerCase();
        const ticketName = order.ticket_name.toLowerCase();
        const parsedSearch = search?.toLowerCase();

        return (
          eventName.includes(parsedSearch) || ticketName.includes(parsedSearch)
        );
      })
    : orders?.data;

  return {
    filteredOrders,
  };
}
