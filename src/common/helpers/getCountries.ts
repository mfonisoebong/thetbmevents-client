import { CountryData } from "@common/typings"
import Axios from "axios"

interface State {
  id: number
  name: string
  iso2: string
}

export const getCountries = async (): Promise<CountryData[]> => {
  return Axios.get("/data/countries.json").then((res) => res.data)
}

export const getStatesInCountry = async (code: string): Promise<string[]> => {
  const config = {
    method: "get",
    url: `https://api.countrystatecity.in/v1/countries/${code}/states`,
    headers: {
      "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_GEO_DATA_API_KEY,
    },
  }
  const citiesData: State[] = await Axios(config).then((res) => res.data)
  const cities = await citiesData.map((city) => city.name)
  return cities
}
