import { HomePageData } from "@lib/home/typings";
import { axiosInstance } from "@common/utils/axiosInstance";
import { HttpResponse } from "@common/typings";

export const getHomepageData = async (): Promise<HomePageData> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<HomePageData> = await AppAxios({
    url: "/homepage",
  }).then((res) => res.data);
  return res.data;
};
