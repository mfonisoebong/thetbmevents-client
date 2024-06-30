import { useQuery } from "@tanstack/react-query"
import { getBanks } from "../helpers/getBanks"

export default function useBanks() {
  const banks = useQuery(["banks"], getBanks)

  return banks
}
