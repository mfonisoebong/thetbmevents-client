import { useRouter } from "next/router";
import { getEventsOverview } from "@lib/admin-overview/helpers/getEventsOverview";
import { useQuery } from "@tanstack/react-query";

export default function useEventsOverview() {
  const router = useRouter();
  const month = router.query.event_overview_month as string;
  const fetcher = () => getEventsOverview(month);

  if (!month) {
    const date = new Date();
    router.push({
      query: {
        ...router.query,
        event_overview_month: date.getMonth() + 1,
      },
    });
  }

  const eventsOverview = useQuery(["event_overview", month], fetcher);

  return eventsOverview;
}
