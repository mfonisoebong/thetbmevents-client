import { FC } from "react";
import { DetailProps } from "@lib/dashboard-ticket/typings";

const Detail: FC<DetailProps> = ({ title, body }) => {
  return (
    <div className={"space-y-2"}>
      <p className={"font-semibold text-gray-400 text-sm md:text-xl uppercase"}>
        {title}
      </p>
      <p className={"font-semibold text-black text-sm md:text-xl"}>{body}</p>
    </div>
  );
};

export default Detail;
