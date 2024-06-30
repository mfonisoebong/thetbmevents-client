import { HttpResponse } from "@common/typings"
import { axiosInstance } from "@common/utils/axiosInstance"

type Token = { access_token: string }

export const getUserToken = async (id?: string): Promise<Token> => {
  const { AppAxios } = axiosInstance()
  const res: HttpResponse<Token> = await AppAxios({
    url: `/admin/users/organizers/login-as/${id}`,
    method: "POST",
  }).then((res) => res.data)
  return res.data
}
