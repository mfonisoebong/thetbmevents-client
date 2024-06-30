import { axiosInstance } from "@common/utils/axiosInstance"
import { Slide, SliderData } from "../typings"

export const getSlides = async (): Promise<Slide[]> => {
  const { AppAxios } = axiosInstance()

  const slidesData: SliderData[] = await AppAxios({
    url: "/admin/events/sliders",
  }).then((res) => res.data.data)

  const slides: Slide[] = slidesData.map((s) => ({
    eventId: s.event_id,
  }))
  return slides
}
