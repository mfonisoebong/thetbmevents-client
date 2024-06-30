import { axiosInstance } from "@common/utils/axiosInstance";
import { EventsOverviewData } from "@lib/admin-overview/typings";
import { HttpResponse } from "@common/typings";

export const getEventsOverview = async (
  month: string,
): Promise<EventsOverviewData> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<EventsOverviewData> = await AppAxios({
    url: `/admin/overview/events?month=${month}`,
  }).then((res) => res.data);

  return res.data;
};
