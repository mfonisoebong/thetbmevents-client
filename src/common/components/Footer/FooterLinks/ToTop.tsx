import IconButton from "@common/components/IconButton"
import ArrowUp from "@common/components/Icons/ArrowUp"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import { FC } from "react"

const ToTop: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium)
  const iconSize = isMediumDevice ? 25 : 20

  const scrollToTop = () => {
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: 0,
    })
  }

  return (
    <div className="w-full">
      <IconButton
        onClick={scrollToTop}
        icon={<ArrowUp size={iconSize} />}
        className="mx-auto bg-gray-700 justify-center space-x-0 p-3 rounded-full"
        variant="stroke"
      />
    </div>
  )
}

export default ToTop
