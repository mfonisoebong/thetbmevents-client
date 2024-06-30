import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import Image from "next/image"
import { FC } from "react"

const Sidebar: FC = () => {
  const isLargeDevice = useMediaQuery(Device.large)
  const imageSize = isLargeDevice ? 150 : 120

  return (
    <div className="hidden md:grid fixed right-0 md:w-4/12 h-full bg-main place-items-center">
      <Image
        src="/images/tbm_logo.png"
        alt="TBM logo"
        width={imageSize}
        height={imageSize}
      />
    </div>
  )
}

export default Sidebar
