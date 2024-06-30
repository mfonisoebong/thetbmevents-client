import { AuthenticationData } from "@lib/auth-pages/tyings";
import { OrganizationSignUpFormType } from "../utils/signupFormSchema";
import { HttpResponse } from "@common/typings";

import { UserToken } from "@lib/login/helpers/loginUser";
import Cookies from "js-cookie";
import { axiosInstance } from "@common/utils/axiosInstance";

export const signupUser = async (
  data: AuthenticationData<OrganizationSignUpFormType>,
): Promise<void> => {
  const { AppAxios } = axiosInstance();

  const userData = {
    buisness_name: data.buisnessName,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    country: data.country,
    phone_number: data.phoneNumber,
    phone_dial_code: data.dialCode,
  };

  const res: HttpResponse<UserToken> = await AppAxios({
    url: `/auth/register?recaptcha_token=${data.recaptcha}`,
    method: "POST",
    data: userData,
  }).then((res) => res.data);
  Cookies.remove("admin_id");
  Cookies.set("access_token_enocded", res.data.access_token);
};
