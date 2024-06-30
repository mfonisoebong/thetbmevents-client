import useAuth from "@common/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { getUserEvents } from "../helpers/getUserEvents"

export default function useUserEvents() {
  const { user } = useAuth()
  const userEvents = useQuery(["user", user.data?.id], getUserEvents)

  return userEvents
}
