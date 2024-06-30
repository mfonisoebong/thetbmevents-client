import { TestimoniesData } from "@lib/admin-testimonies/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getTestimonies = async (): Promise<TestimoniesData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<TestimoniesData> = await AppAxios({
    url: "/admin/testimonies",
  }).then((res) => res.data);

  return res.data;
};
