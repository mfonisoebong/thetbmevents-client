import Axios from "axios"
import Cookies from "js-cookie"

export const axiosInstance = () => {
  const token = Cookies.get("access_token_enocded")
  const vellaToken = process.env.NEXT_PUBLIC_VELLA_API_KEY
  const AppAxios = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    withCredentials: true,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const VellaAxios = Axios.create({
    baseURL: "https://sandbox.vella.finance/api/v1",
    headers: {
      Authorization: `Bearer ${vellaToken}`,
    },
  })

  return {
    AppAxios,
    VellaAxios,
  }
}
