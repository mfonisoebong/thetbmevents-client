import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const CaretLeft: FC<IconProps> = (props) => {
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
        d="M9.63175 12.3781C9.40152 12.1787 9.40152 11.8216 9.63175 11.6222L14.368 7.52047C14.6918 7.24003 15.1953 7.47006 15.1953 7.89844L15.1953 16.1018C15.1953 16.5302 14.6918 16.7602 14.368 16.4798L9.63175 12.3781Z"
        fill={color}
      />
    </svg>
  );
};

export default CaretLeft;
