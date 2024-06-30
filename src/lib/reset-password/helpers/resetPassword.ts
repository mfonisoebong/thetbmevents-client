import { axiosInstance } from "@common/utils/axiosInstance"
import { ResePasswordForm } from "../utils/resetPasswordSchema"
import { HttpResponse } from "@common/typings"

export type Data = {
  token: string
  data: ResePasswordForm
}
export const resetPassword = async (data: Data): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    method: "POST",
    url: "/auth/password-reset",
    data: {
      token: data.token,
      password: data.data.password,
      password_confirmation: data.data.confirmPassword,
    },
  }).then((res) => res.data)
}
