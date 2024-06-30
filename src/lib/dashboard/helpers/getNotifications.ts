import { HttpResponse } from "@common/typings";
import { Notification } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getNotifications = async (): Promise<Notification[]> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<Notification[]> = await AppAxios({
    url: "/notifications",
  }).then((res) => res.data);

  return res.data;
};
