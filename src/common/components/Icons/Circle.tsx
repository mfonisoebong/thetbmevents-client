import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Cirlce: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <circle cx="6" cy="6" r="6" fill={color} />
    </svg>
  )
}

export default Cirlce
