import { axiosInstance } from "@common/utils/axiosInstance";
import { CouponSchemaType } from "@lib/coupons/utils/couponFormSchema";

type Params = CouponSchemaType & {
  id?: string;
};

export const saveCoupon = async (data: Params) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: data.id ? `/coupons/${data.id}` : "/coupons",
    method: data.id ? "PATCH" : "POST",
    data: {
      event_id: data.eventId,
      name: data.name,
      code: data.code,
      start_date_time: data.startDateTime,
      end_date_time: data.endDateTime,
      type: data.type,
      value: data.value,
      limit: data.limit,
      referral_name: data.referralName,
    },
  }).then((res) => res.data);
};
