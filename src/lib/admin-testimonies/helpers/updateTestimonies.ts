import { TestimoniesFormType } from "@lib/admin-testimonies/utils/testimoniesSchema";
import { axiosInstance } from "@common/utils/axiosInstance";
import { isBase64 } from "@common/utils/isBase64";
import { dataURLtoFile } from "@common/utils/dataUrlToFile";

export const updateTestimonies = async (data: TestimoniesFormType) => {
  const { AppAxios } = axiosInstance();
  const formData = new FormData();
  const hasIds = data.testimonies[0].id ? true : false;

  data.testimonies.forEach((t) => {
    const isValidFile = isBase64(t.avatar);
    t.id && formData.append("ids[]", t.id.toString());
    isValidFile &&
      !hasIds &&
      formData.append("avatars[]", dataURLtoFile(t.avatar, "avatars"));
    isValidFile &&
      hasIds &&
      formData.append(
        `avatar_${t?.id?.toString()}`,
        dataURLtoFile(t.avatar, "avatars"),
      );

    formData.append("names[]", t.name);
    formData.append("channels[]", t.channel);
    formData.append("descriptions[]", t.description);
  });
  formData.append("heading", data.heading);
  formData.append("sub_heading", data.subHeading);

  await AppAxios({
    url: hasIds ? "/admin/testimonies/update" : "/admin/testimonies",
    method: "POST",
    data: formData,
  });
};
