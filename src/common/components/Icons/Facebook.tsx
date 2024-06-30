import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Facebook: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 13 13"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M12.1886 6.61446C12.1886 3.41836 9.59767 0.827393 6.40157 0.827393C3.20547 0.827393 0.614502 3.41836 0.614502 6.61446C0.614502 9.5029 2.73074 11.8971 5.49734 12.3312V8.28728H4.02795V6.61446H5.49734V5.33949C5.49734 3.88911 6.36132 3.08796 7.68321 3.08796C8.31617 3.08796 8.97862 3.20099 8.97862 3.20099V4.62515H8.24892C7.53004 4.62515 7.3058 5.07129 7.3058 5.52938V6.61446H8.91079L8.65423 8.28728H7.3058V12.3312C10.0724 11.8971 12.1886 9.5029 12.1886 6.61446Z"
        fill={color}
      />
    </svg>
  )
}

export default Facebook
