import { AxiosError } from "axios"

export const errorParser = (err: unknown): string => {
  if (err instanceof AxiosError) {
    return err.response?.data.message
  }

  if (err instanceof Error) {
    return err.message
  }

  return "An error occured"
}
