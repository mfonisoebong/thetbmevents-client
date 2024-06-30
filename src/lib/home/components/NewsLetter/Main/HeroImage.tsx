import Image from "next/image"
import { FC } from "react"

const HeroImage: FC = () => {
  return (
    <div className="w-full md:w-1/2 flex justify-center lg:justify-end">
      <Image
        src="/images/newsletter_hero.png"
        alt="Newsletter"
        width={500}
        height={600}
        className="w-[calc(40vw+5rem)] md:w-9/12 lg:w-9/12"
      />
    </div>
  )
}

export default HeroImage
