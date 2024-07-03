import { useRouter } from "next/router";
import { getEventsOverview } from "@lib/admin-overview/helpers/getEventsOverview";
import { useQuery } from "@tanstack/react-query";

export default function useEventsOverview() {
  const router = useRouter();
  const date = new Date();

  const month =
    (router.query.event_overview_month as string) ??
    (date.getMonth() + 1).toString();
  const fetcher = () => getEventsOverview(month);

  const eventsOverview = useQuery(["event_overview", month], fetcher);

  return eventsOverview;
}
