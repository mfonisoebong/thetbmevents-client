import { FC } from "react";
import { CardProps } from "@lib/contact-us/typings";

const Card: FC<CardProps> = ({ title, children, icon }) => {
  return (
    <div className={"flex space-x-7 h-20"}>
      <div className={"w-16 h-16 bg-main rounded-full grid place-items-center"}>
        {icon}
      </div>
      <div className={"space-y-2 text-sm"}>
        <h3 className={"uppercase text-gray-800 font-semibold"}>{title}</h3>
        <div className={"text-gray-500 font-normal"}>{children}</div>
      </div>
    </div>
  );
};

export default Card;
