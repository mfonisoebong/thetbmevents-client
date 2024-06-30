import { FC } from "react";
import { EventProps } from "@lib/dashboard-finance/typings";
import Avatar from "@common/components/Avatar";

const Event: FC<EventProps> = ({ image, name, tickets }) => {
  console.log(image);

  return (
    <div className={"flex space-x-5"}>
      <Avatar image={image} size={52} />
      <div>
        <h4 className={"text-gray-600 font-bold"}>{name}</h4>
        <h6 className={"text-sm font-bold text-gray-600"}>{tickets} tickets</h6>
      </div>
    </div>
  );
};

export default Event;
