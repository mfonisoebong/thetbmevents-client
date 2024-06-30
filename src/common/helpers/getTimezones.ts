import { Timezone } from "@common/typings"
import axios from "axios"

export const getTimezones = async (): Promise<Timezone[]> => {
  return axios("/data/timezones.json").then((res) => res.data)
}
