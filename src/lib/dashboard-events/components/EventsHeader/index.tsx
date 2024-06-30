import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import { FC } from "react";
import HeaderActions from "./HeaderActions";

const EventsHeader: FC = () => {
  return (
    <OverviewCard theme="light">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 lg:space-y-0">
        <h3 className="font-bold text-sm md:text-lg lg:text-xl">Events</h3>
        <HeaderActions />
      </div>
    </OverviewCard>
  );
};

export default EventsHeader;
