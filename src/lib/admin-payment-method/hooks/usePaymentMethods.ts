import {useQuery} from "@tanstack/react-query"
import {getPaymentMethod} from "../helpers/getPaymentMethods"
import {Gateway} from "../typings"

export default function usePaymentMethods(gateway: Gateway) {
  const fetcher = () => getPaymentMethod(gateway)

  return useQuery(["admin-payment-method", gateway], fetcher)
}
