import { Overview } from "@lib/dashboard-overview/typings";
import { HttpResponse } from "@common/typings";

import { axiosInstance } from "@common/utils/axiosInstance";

export const getOverview = async (): Promise<Overview> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<Overview> = await AppAxios({
    url: "/profile/overview",
  }).then((res) => res.data);
  return res.data;
};
