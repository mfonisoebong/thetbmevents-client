import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "@lib/coupons/helpers/getCoupons";

export default function useCoupons() {
  const router = useRouter();
  const page = router.query?.page as string;

  const fetcher = () => getCoupons(page);

  const coupons = useQuery({
    queryFn: fetcher,
    queryKey: ["coupons", page],
  });

  return coupons;
}
