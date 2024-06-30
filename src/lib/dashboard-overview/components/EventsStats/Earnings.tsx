import { numberFormatter } from "@common/utils/numberFormatter";
import { FC } from "react";
import EarningsChart from "./EarningsChart";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";

const Earnings: FC = () => {
  const { data: overview } = useOverview();

  return (
    <div className="mt-3 md:m-0 flex flex-col-reverse space-y-6 md:space-y-0   md:flex-row md:items-center justify-between h-full">
      <div className="space-y-2 w-full lg:w-7/12">
        <h6 className="text-gray-300 font-semibold text-xs">This month</h6>
        <h5 className="text-white font-bold text-sm">
          &#8358;
          {typeof overview?.earnings.amount === "number"
            ? numberFormatter(overview.earnings.amount)
            : "----"}
        </h5>
      </div>
      <EarningsChart />
    </div>
  );
};

export default Earnings;
