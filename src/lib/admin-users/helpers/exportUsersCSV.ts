import { axiosInstance } from "@common/utils/axiosInstance";

export const exportUsersCSV = async (ids: string): Promise<string> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: "/admin/users/export",
    method: "POST",
    data: {
      ids,
    },
  }).then((res) => res.data);
};
