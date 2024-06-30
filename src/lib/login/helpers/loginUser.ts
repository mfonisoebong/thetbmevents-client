import { HttpResponse } from "@common/typings";
import { LoginFormType } from "../utils/loginFormSchema";

import { AuthenticationData } from "@lib/auth-pages/tyings";
import Cookies from "js-cookie";
import { axiosInstance } from "@common/utils/axiosInstance";

export type UserToken = {
  access_token: string;
};

export const loginUser = async (
  data: AuthenticationData<LoginFormType>,
): Promise<void> => {
  const { AppAxios } = axiosInstance();
  const { recaptcha, ...restData } = data;

  const res: HttpResponse<UserToken> = await AppAxios({
    url: `/auth/login?recaptcha_token=${recaptcha}`,
    data: restData,
    method: "POST",
  }).then((res) => res.data);
  Cookies.remove("admin_id");

  Cookies.set("access_token_enocded", res.data.access_token);
};
