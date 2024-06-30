import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "@lib/admin-order-history/helpers/getOrderHistory";

export default function useOrderHistory() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const fetcher = () => getOrderHistory(page ?? undefined);

  const orderHistrory = useQuery(["admin-order-history", page], fetcher);

  return orderHistrory;
}
