import { ContactUsFormType } from "@lib/contact-us/utils/contactUsSchema";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const sendContactMessage = async (
  data: ContactUsFormType & { token: string },
): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();
  const { token, ...restData } = data;
  return AppAxios({
    method: "POST",
    data: restData,
    url: `/contact-messages?recaptcha_token=${token}`,
  }).then((res) => res.data);
};
