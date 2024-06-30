import { SameType } from "@common/typings"

export type Event = SameType<"id" | "title" | "logo", string>

export interface SlidersContextValues {
  slides: Slide[]
  editSlides: (index: number, id: string) => void
}

export interface Slide {
  eventId?: string
}

export interface SlideProps {
  index: number
}

export interface SliderData {
  id: number
  event_id: string
  event_logo: string
}

export interface SliderProviderProps {
  fetchedSlides: Slide[]
}
