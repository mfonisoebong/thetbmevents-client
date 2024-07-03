import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getCoupon } from "@lib/coupons/helpers/getCoupon";

export default function useCoupon() {
  const router = useRouter();
  const id = router.query?.id as string;

  const fetcher = () => getCoupon(id);

  const coupon = useQuery({
    queryFn: fetcher,
    queryKey: ["coupons view", id],
  });

  return coupon;
}
