import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export interface Data {
  id: string;
}

export const deleteTicket = async (data: Data): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/tickets/${data.id}`,
    method: "DELETE",
  }).then((res) => res.data);
};
