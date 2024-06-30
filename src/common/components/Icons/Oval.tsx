import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Oval: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 22 7"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <rect width="22" height="7" rx="3.5" fill={color} />
    </svg>
  )
}

export default Oval
