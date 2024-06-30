import { HttpResponse } from "@common/typings";
import { EventData } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getEvents = async (): Promise<EventData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<EventData> = await AppAxios({
    url: "/events/latest",
  }).then((res) => res.data);

  return res.data;
};
