import { axiosInstance } from "@common/utils/axiosInstance"
import { Slide } from "../typings"

export const updateSlides = async (slides: Slide[]) => {
  const { AppAxios } = axiosInstance()

  const data = slides.map((s) => ({
    event_id: s.eventId,
  }))

  return AppAxios({
    url: "/admin/events/sliders",
    method: "PATCH",
    data: {
      sliders: data,
    },
  }).then((res) => res.data)
}
