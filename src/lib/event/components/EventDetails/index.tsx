import { FC } from "react";
import Details from "./Details";
import DateAndLocation from "@lib/event/components/EventDetails/DateAndLocation";

const EventDetails: FC = () => {
  return (
    <div
      className={
        "flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:space-x-20"
      }
    >
      <Details />
      <DateAndLocation />
    </div>
  );
};

export default EventDetails;
