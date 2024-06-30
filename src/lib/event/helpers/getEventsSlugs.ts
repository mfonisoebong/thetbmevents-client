import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";
import { EventSlug } from "../typings";

export const getEventsSlugs = async (): Promise<EventSlug[]> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<EventSlug[]> = await AppAxios({
    url: "/events/slugs",
  }).then((res) => res.data);

  return res.data;
};
