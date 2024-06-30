import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const CaretRight: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7589 11.6219C14.9891 11.8213 14.9891 12.1784 14.7589 12.3778L10.0226 16.4795C9.69882 16.76 9.19531 16.5299 9.19531 16.1016L9.19531 7.89816C9.19531 7.46978 9.69882 7.23976 10.0226 7.5202L14.7589 11.6219Z"
        fill={color}
      />
    </svg>
  );
};

export default CaretRight;
