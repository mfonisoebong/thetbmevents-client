import { axiosInstance } from "@common/utils/axiosInstance"

type Data = {
  email: string
}

export const sendPasswordResetLink = async (data: Data) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/auth/send-password-reset",
    method: "POST",
    data,
  }).then((res) => res.data)
}
