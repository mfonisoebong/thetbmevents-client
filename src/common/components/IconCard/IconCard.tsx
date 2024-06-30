import { IconCardProps } from "@common/typings"
import Image from "next/image"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

const IconCard: FC<IconCardProps> = ({ icon, text, title, className }) => {
  const c = twMerge(
    "w-[16.87rem] h-44 relative grid place-items-center w-full",
    className
  )
  return (
    <div className={c}>
      <Image src={icon} alt="" width={80} className="absolute" height={80} />
      <div className="z-20 space-y-7 text-center relative top-[22%]">
        <h3 className="font-semibold text-2xl">{text}</h3>
        <p className="text-[#cccbca] font-semibold uppercase">{title}</p>
      </div>
    </div>
  )
}

export default IconCard
