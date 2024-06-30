import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";
import Cookies from "js-cookie";
import { UserToken } from "@lib/login/helpers/loginUser";

export const loginAsAdmin = async (): Promise<void> => {
  const { AppAxios } = axiosInstance();
  const adminId = Cookies.get("admin_id");
  const res: HttpResponse<UserToken> = await AppAxios({
    url: "/auth/login-with-id",
    method: "POST",
    data: {
      id: adminId,
    },
  }).then((res) => res.data);

  Cookies.remove("admin_id");
  Cookies.set("access_token_enocded", res.data.access_token);
};
