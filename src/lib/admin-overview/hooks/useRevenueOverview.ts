import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getRevenueOverview } from "@lib/admin-overview/helpers/getRevenueOverview";

export default function useRevenueOverview() {
  const router = useRouter();
  const date = new Date();

  const month =
    (router.query.revenue_overview_month as string) ??
    (date.getMonth() + 1).toString();
  const fetcher = () => getRevenueOverview(month);

  const revenueOverview = useQuery(["admin_revenue_overview", month], fetcher);

  return revenueOverview;
}
