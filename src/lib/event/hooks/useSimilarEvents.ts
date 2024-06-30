import { useRouter } from "next/router";
import useEvent from "@lib/event/hooks/useEvent";
import { getSimilarEvents } from "@lib/event/helpers/getSimilarEvents";
import { useQuery } from "@tanstack/react-query";

export default function useSimilarEvents() {
  const { query } = useRouter();
  const eventsData = useEvent();
  const eventCategory = eventsData.data?.event.categories ?? "";
  const eventId = eventsData.data?.event.id ?? "";
  const fetcher = () => getSimilarEvents(eventCategory, eventId);

  const similarEvents = useQuery(
    ["similar-events", eventCategory, eventId],
    fetcher,
    {
      enabled: eventsData.isSuccess,
    },
  );

  return similarEvents;
}
