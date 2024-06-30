import { useQuery } from "@tanstack/react-query";
import useAuth from "@common/hooks/useAuth";
import { getSales } from "@lib/dashboard-sales/helpers/getSales";
import { useRouter } from "next/router";

export default function useSales() {
  const { user } = useAuth();
  const { query } = useRouter();
  const page = query?.page as string;
  const fetcher = () => getSales(page);
  const sales = useQuery(["sales", user.data?.id, page], fetcher);

  return sales;
}
