import { dataURLtoFileAsync } from "@common/utils/dataUrlToFile";
import { axiosInstance } from "@common/utils/axiosInstance";

export const uploadAvatar = async (image: string) => {
  const { AppAxios } = axiosInstance();
  const formData = new FormData();
  const file = await dataURLtoFileAsync(image, "avatar");
  formData.append("avatar", file);

  return AppAxios({
    url: "/profile/avatar/upload",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
