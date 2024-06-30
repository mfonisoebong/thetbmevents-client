import { decodeBase64 } from "@common/utils/decodeBase64";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getTicketQrCode = async (id?: string): Promise<string> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: `/tickets/qrcode/${id}`,
  }).then((res) => decodeBase64(res.data));
};
