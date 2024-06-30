import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getTopCustomers } from "../helpers/getTopCustomers"

export default function useTopCustomers() {
  const searchParams = useSearchParams()
  const year = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const month = searchParams.get("customer_month") ?? currentMonth.toString()
  const fetcher = () => getTopCustomers(month, year)
  const customers = useQuery(["admin-top-customers", month, year], fetcher)

  return customers
}
