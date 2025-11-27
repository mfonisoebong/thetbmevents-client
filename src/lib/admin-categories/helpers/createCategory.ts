import { axiosInstance } from "@common/utils/axiosInstance";
import { CategoryFormType } from "../utils/categorySchema";

export const createCategory = async (data: CategoryFormType) => {
  const { AppAxios } = axiosInstance();

  const formData = new FormData();

  formData.append("category", data.category);
  formData.append("slug", data.slug);
  if (data.icon) {
    formData.append("icon", data.icon);
  }

  return AppAxios({
    url: "/admin/events/categories",
    method: "POST",
    data: formData,
  }).then((res) => res.data);
};
