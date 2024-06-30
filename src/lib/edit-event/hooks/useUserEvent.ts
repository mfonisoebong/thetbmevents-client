import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getUserEvent } from "@lib/edit-event/helpers/getUserEvent";

export default function useUserEvent() {
  const { query } = useRouter();
  const id = query?.id as string;
  const fetcher = () => getUserEvent(id);
  const event = useQuery(["user-event", id], fetcher, {
    enabled: typeof id === "string",
  });

  return event;
}
