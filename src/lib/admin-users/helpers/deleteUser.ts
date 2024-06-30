import { axiosInstance } from "@common/utils/axiosInstance";

export const deleteUser = async (id: string) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/admin/users/${id}`,
    method: "DELETE",
  }).then((res) => res.data);
};
