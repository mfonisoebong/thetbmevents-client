import { axiosInstance } from "@common/utils/axiosInstance";

export const exportAttendees = (eventId: string) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/events/${eventId}/export/attendees`,
    method: "POST",
  }).then((res) => res.data);
};
