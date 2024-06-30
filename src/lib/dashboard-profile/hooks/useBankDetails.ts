import { useQuery } from "@tanstack/react-query"
import { getBankDetails } from "../helpers/getBankDetails"

export default function useBankDetails() {
  const bankDetails = useQuery(["bank_details"], getBankDetails)

  return bankDetails
}
