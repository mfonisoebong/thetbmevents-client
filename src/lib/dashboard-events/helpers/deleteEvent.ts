import { axiosInstance } from "@common/utils/axiosInstance";

export const deleteEvent = async ({ id }: { id: string }) => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: `/events/${id}`,
    method: "DELETE",
  }).then((res) => res.data);
};
