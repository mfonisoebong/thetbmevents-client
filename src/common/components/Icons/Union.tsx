import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const Union: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 20 14"
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2H0V0H20V2ZM17 8H3V6H17V8ZM6 14H14V12H6V14Z"
        fill={color}
      />
    </svg>
  );
};

export default Union;
