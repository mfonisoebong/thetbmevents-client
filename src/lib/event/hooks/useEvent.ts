import { getEvent } from "@lib/event/helpers/getEvent";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export default function useEvent() {
  const { query } = useRouter();
  const slug = query?.slug as string;
  const fetcher = () => getEvent(slug);

  const eventQuery = useQuery(["event", slug], fetcher);

  return eventQuery;
}
