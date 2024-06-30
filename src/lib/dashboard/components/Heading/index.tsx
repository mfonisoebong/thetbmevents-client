import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import { HeadiingProps } from "@lib/dashboard/typings";

const Heading: FC<HeadiingProps> = ({ title }) => {
  return <OverviewCard theme={"light"} title={title} />;
};

export default Heading;
