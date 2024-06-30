import { FeaturesFormType } from "@lib/admin-features/utils/featuresSchema";
import { axiosInstance } from "@common/utils/axiosInstance";
import { dataURLtoFile } from "@common/utils/dataUrlToFile";
import { isBase64 } from "@common/utils/isBase64";

export const updateFeatures = async (data: FeaturesFormType) => {
  const formData = new FormData();
  const { AppAxios } = axiosInstance();
  const hasIds = data.features[0].id ? true : false;

  data.features.forEach((f) => {
    const isValidFile = isBase64(f.thumbnail);
    f.id && formData.append("ids[]", f.id.toString());
    isValidFile &&
      !hasIds &&
      formData.append("thumbnails[]", dataURLtoFile(f.thumbnail, "thumbnail"));

    isValidFile &&
      hasIds &&
      formData.append(
        `thumbnail_${f?.id?.toString()}`,
        dataURLtoFile(f.thumbnail, "thumbnail"),
      );

    formData.append("features[]", f.title);
  });
  formData.append("heading", data.heading);
  formData.append("sub_heading", data.subHeading);
  await AppAxios({
    url: hasIds ? "/admin/features/update" : "/admin/features",
    method: "POST",
    data: formData,
  });
};
