import { HttpResponse } from "@common/typings";
import { NewsletterForm } from "../utils/newsletterSchema";
import { axiosInstance } from "@common/utils/axiosInstance";

export const signupForNewsletter = async (
  data: NewsletterForm,
): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse = await AppAxios({
    url: "/newsletter",
    method: "POST",
    data,
  }).then((res) => res.data);

  return res;
};
