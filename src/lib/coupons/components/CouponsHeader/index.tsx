import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import { HeaderActions } from "./HeaderActions";

export const CouponsHeader: FC = () => {
  return (
    <OverviewCard theme="light">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 lg:space-y-0">
        <h3 className="font-bold text-sm md:text-lg lg:text-xl">Coupons</h3>
        <HeaderActions />
      </div>
    </OverviewCard>
  );
};
