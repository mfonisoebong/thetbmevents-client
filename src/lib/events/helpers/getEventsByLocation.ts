import { HttpResponse } from "@common/typings";
import { LocationEvents } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getEventsByLocation = async (): Promise<LocationEvents> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<LocationEvents> = await AppAxios({
    url: "/events/location",
  }).then((res) => res.data);
  return res.data;
};
