import { DetailProps } from "@common/typings"
import { FC } from "react"

const Detail: FC<DetailProps> = ({ icon, text }) => {
  return (
    <div className="flex space-x-4 items-center">
      <p className="bg-mainBlue p-3 rounded-full">{icon}</p>
      <p className="text-white font-medium text-xs md:text-sm">{text}</p>
    </div>
  )
}

export default Detail
