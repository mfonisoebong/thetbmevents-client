import { FC } from "react"
import HeroImage from "./HeroImage"
import Form from "./Form"

const Main: FC = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row space-x-2 items-center">
      <Form />
      <HeroImage />
    </div>
  )
}

export default Main
