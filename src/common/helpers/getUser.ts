import { axiosInstance } from "@common/utils/axiosInstance";
import { AdminUser, IndividualUser, OrganizerUser } from "@common/typings";
export const getUser = async (
  token?: string,
): Promise<IndividualUser | OrganizerUser | AdminUser> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/auth/user",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
