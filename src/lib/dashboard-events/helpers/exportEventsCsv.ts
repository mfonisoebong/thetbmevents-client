import { axiosInstance } from "@common/utils/axiosInstance";

export const exportEventCsv = async (): Promise<string> => {
  const { AppAxios } = axiosInstance();
  return AppAxios({
    url: "/events/export",
    method: "POST",
  }).then((res) => res.data);
};
