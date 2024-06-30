import { HttpResponse } from "@common/typings"
import { NewsletterSignupData } from "../typings"
import { axiosInstance } from "@common/utils/axiosInstance"

export const getNewsletterSignup = async (
  page: string | null
): Promise<NewsletterSignupData> => {
  const { AppAxios } = axiosInstance()

  const url = page ? "/admin/newsletters" : `/admin/newsletters?page=${page}`

  const res: HttpResponse<NewsletterSignupData> = await AppAxios({
    url,
  }).then((res) => res.data)

  return res.data
}
