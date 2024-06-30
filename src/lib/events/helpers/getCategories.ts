import { HttpResponse } from "@common/typings";
import { Category } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getCategories = async (): Promise<Category[]> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<Category[]> = await AppAxios({
    url: "/events/categories",
  }).then((res) => res.data);

  return res.data;
};
