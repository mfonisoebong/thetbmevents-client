import { FC } from "react";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";

const SalesHeader: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 17 : 14;
  return (
    <div className={"space-y-5"}>
      <OverviewCard theme={"light"} title={"Sales"} />
    </div>
  );
};

export default SalesHeader;
