import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";

const SalesHeader: FC = () => {
  return (
    <div className={"space-y-5"}>
      <OverviewCard theme={"light"} title={"Sales"} />
    </div>
  );
};

export default SalesHeader;
