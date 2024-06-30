import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const logoutUser = async (token?: string): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/auth/logout",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
