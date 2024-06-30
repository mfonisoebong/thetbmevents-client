import { axiosInstance } from "@common/utils/axiosInstance";

export const removeAvatar = async () => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: "/profile/avatar/remove",
    method: "POST",
  });
};
