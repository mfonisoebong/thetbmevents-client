import { PasswordForm } from "../utils/passwordFormSchema";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const changePassword = async (
  data: PasswordForm,
): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: "/auth/user/password",
    method: "PATCH",
    data: {
      password: data.password,
      password_confirmation: data.confirmPassword,
    },
  }).then((res) => res.data);
};
