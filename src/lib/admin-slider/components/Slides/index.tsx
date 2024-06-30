import { FC } from "react"
import Slide from "./Slide"
import useSlidersContext from "@lib/admin-slider/hooks/useSlidersContext"

const Slides: FC = () => {
  const { slides } = useSlidersContext()
  const firstTwoSlides = slides.slice(0, 2)
  const lastSlideIndex = slides.length - 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-center lg:space-x-4  space-y-6 lg:space-y-0 w-full">
        {firstTwoSlides.map((s, index) => (
          <Slide index={index} key={`${s.eventId}${index}`} />
        ))}
      </div>
      <div className="flex justify-center">
        <Slide index={lastSlideIndex} />
      </div>
    </div>
  )
}

export default Slides
