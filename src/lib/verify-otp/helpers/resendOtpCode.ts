import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const resendOtpCode = async (): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/auth/resend-otp",
    method: "POST",
  }).then((res) => res.data);
};
