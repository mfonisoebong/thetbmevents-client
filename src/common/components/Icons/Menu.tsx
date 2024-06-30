import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Menu: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 17 12"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path d="M0 10V12H17V10H0ZM0 5V7H17V5H0ZM0 0V2H17V0H0Z" fill={color} />
    </svg>
  )
}

export default Menu
