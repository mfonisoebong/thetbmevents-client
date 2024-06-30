import { FC } from "react";
import { HeadingProps } from "@lib/admin-dashboard/typings";

const Heading: FC<HeadingProps> = ({ title }) => {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold uppercase">{title}</h2>
    </div>
  );
};

export default Heading;
