import { axiosInstance } from "@common/utils/axiosInstance";
import { CategoryFormType } from "../utils/categorySchema";

export const updateCategory = async (
  data: CategoryFormType & {
    id: string;
  },
) => {
  const { id, ...restData } = data;
  const { AppAxios } = axiosInstance();

  const formData = new FormData();

  formData.append("category", restData.category);
  formData.append("slug", restData.slug);
  if (data.icon) {
    formData.append("icon", restData.icon);
  }

  return AppAxios({
    url: `/admin/events/categories/${id}`,
    method: "POST",
    data: formData,
  }).then((res) => res.data);
};
