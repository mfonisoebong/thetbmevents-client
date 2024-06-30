import { HttpResponse } from "@common/typings";
import { UserEvent } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

interface EventData {
  events: UserEvent[];
}

export const getUserEvents = async (): Promise<UserEvent[]> => {
  const { AppAxios } = axiosInstance();
  const res: HttpResponse<EventData> = await AppAxios({
    url: "/events/user",
  }).then((res) => res.data);

  return res.data.events;
};
