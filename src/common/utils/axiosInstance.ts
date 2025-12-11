import Axios from "axios"
import Cookies from "js-cookie"

export const axiosInstance = () => {
  const token = Cookies.get("access_token_enocded")
  const AppAxios = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    withCredentials: true,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  return {
    AppAxios,
  }
}
