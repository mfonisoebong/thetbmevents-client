import { AvatarProps } from "@common/typings";
import { FC } from "react";
import Cirlce from "../Icons/Circle";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Avatar: FC<AvatarProps> = ({ className, image, size = 40 }) => {
  const c = className ?? "";
  const avatarDivClassName = twMerge(
    c,
    "rounded-full object-cover w-full h-full",
  );

  if (!image) {
    return (
      <Image src={"/images/avatar.svg"} alt="" width={size} height={size} />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={image}
        alt=""
        width={size}
        height={size}
        unoptimized
        className={avatarDivClassName}
      />
    </div>
  );
};

export default Avatar;
