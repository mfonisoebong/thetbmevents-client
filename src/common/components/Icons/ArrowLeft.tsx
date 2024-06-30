import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const ArrowLeft: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M8.88458 21.0002L36.5769 21.0002"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.2692 10.6157L7.49615 20.2914C7.38856 20.3799 7.30238 20.4889 7.24336 20.611C7.18433 20.7331 7.15381 20.8655 7.15381 20.9994C7.15381 21.1333 7.18433 21.2657 7.24336 21.3878C7.30238 21.5099 7.38856 21.6188 7.49615 21.7074L19.2692 31.385"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowLeft
