import { FeaturesData } from "@lib/admin-features/typings";
import { axiosInstance } from "@common/utils/axiosInstance";
import { HttpResponse } from "@common/typings";

export const getFeatures = async (): Promise<FeaturesData> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<FeaturesData> = await AppAxios({
    url: "/admin/features",
  }).then((res) => res.data);

  return res.data;
};
