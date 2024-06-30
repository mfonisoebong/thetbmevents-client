import { getRevenue } from "@lib/admin-finances/helpers/getRevenue"
import { useQuery } from "@tanstack/react-query"

export default function useRevenue() {
  const revenue = useQuery(["admin-revenue"], getRevenue)

  return revenue
}
