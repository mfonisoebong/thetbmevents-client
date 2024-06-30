import { HttpResponse } from "@common/typings";
import { VerificationFormType } from "../utils/verificationSchema";
import { axiosInstance } from "@common/utils/axiosInstance";

export const verifyOtp = async ({
  otp,
}: VerificationFormType): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    method: "POST",
    url: "/auth/verify-otp",
    data: {
      otp,
    },
  });
};
