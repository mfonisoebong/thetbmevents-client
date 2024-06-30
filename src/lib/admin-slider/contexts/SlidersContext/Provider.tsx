import { FC, PropsWithChildren, useEffect, useState } from "react"
import { SlidersContext } from "./Context"
import { Slide, SliderProviderProps } from "@lib/admin-slider/typings"

const SlidersProvider: FC<PropsWithChildren<SliderProviderProps>> = ({
  children,
  fetchedSlides,
}) => {
  const defaultSlides =
    fetchedSlides?.length !== 3 ? [{}, {}, {}] : fetchedSlides
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)

  const editSlides = (index: number, id: string) => {
    if (!slides[index]) return

    setSlides((state) =>
      state.map((s, i) => ({
        eventId: i === index ? id : s.eventId,
      }))
    )
  }

  console.log(slides)

  return (
    <SlidersContext.Provider value={{ slides, editSlides }}>
      {children}
    </SlidersContext.Provider>
  )
}

export default SlidersProvider
