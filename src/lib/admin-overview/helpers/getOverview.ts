import { FC } from "react";
import { OverviewData } from "@lib/admin-overview/typings";
import { axiosInstance } from "@common/utils/axiosInstance";
import { HttpResponse } from "@common/typings";

export const getOverview = async (): Promise<OverviewData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<OverviewData> = await AppAxios({
    url: "/admin/overview",
  }).then((res) => res.data);
  return res.data;
};
