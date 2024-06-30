import { EventData } from "@lib/edit-event/typings";

import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getUserEvent = async (id?: string): Promise<EventData> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<EventData> = await AppAxios({
    url: `/events/user/${id}`,
  }).then((res) => res.data);

  return res.data;
};
