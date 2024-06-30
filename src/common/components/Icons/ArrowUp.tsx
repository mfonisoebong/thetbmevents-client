import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const ArrowUp: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M14.0001 5.9231L14.0001 24.3846"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9231 12.8462L14.4727 4.99752C14.4136 4.92579 14.341 4.86834 14.2596 4.82899C14.1782 4.78964 14.0899 4.76929 14.0006 4.76929C13.9114 4.76929 13.8231 4.78964 13.7417 4.82899C13.6603 4.86834 13.5877 4.92579 13.5286 4.99752L7.07694 12.8462"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowUp
