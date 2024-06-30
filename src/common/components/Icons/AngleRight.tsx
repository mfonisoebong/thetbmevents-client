import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const AngleRight: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M1.03711 15L8.00028 8.03683L1.03711 1.07366"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AngleRight;
