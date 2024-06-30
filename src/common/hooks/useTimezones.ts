import { getTimezones } from "@common/helpers/getTimezones"
import { useQuery } from "@tanstack/react-query"

export default function useTimezones() {
  const timezones = useQuery(["timezones"], getTimezones)

  return timezones
}
