import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../helpers/getNotifications";

export default function useNotifications() {
  const notifications = useQuery(["notifications"], getNotifications);

  return notifications;
}
