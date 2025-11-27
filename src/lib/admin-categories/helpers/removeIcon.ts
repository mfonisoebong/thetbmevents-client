import { axiosInstance } from "@common/utils/axiosInstance";

export const removeIconImage = async (id: string) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/admin/events/categories/${id}/icon`,
    method: "DELETE",
  }).then((res) => res.data);
};
