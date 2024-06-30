import { axiosInstance } from "@common/utils/axiosInstance";
import { RevenueOverviewData } from "@lib/admin-overview/typings";
import { HttpResponse } from "@common/typings";

export const getRevenueOverview = async (
  month: string,
): Promise<RevenueOverviewData> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<RevenueOverviewData> = await AppAxios({
    url: `/admin/overview/revenue?month=${month}`,
  }).then((res) => res.data);

  return res.data;
};
