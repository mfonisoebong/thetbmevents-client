import { FC } from "react"
import FooterLogo from "./FooterLogo"
import Details from "./Details"
import SocialLinks from "./SocialLinks"

const InfoCard: FC = () => {
  return (
    <div>
      <div className="mx-auto w-full md:w-7/12 lg:w-8/12 py-4 ">
        <FooterLogo />
        <Details />
        <SocialLinks />
      </div>
    </div>
  )
}

export default InfoCard
