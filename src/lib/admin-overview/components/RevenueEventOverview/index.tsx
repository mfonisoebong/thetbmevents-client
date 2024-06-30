import { FC } from "react";
import Revenue from "@lib/admin-overview/components/RevenueEventOverview/Revenue";
import Events from "@lib/admin-overview/components/RevenueEventOverview/Events";

const RevenueEventOverview: FC = () => {
  return (
    <section className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
      <Revenue />
      <Events />
    </section>
  );
};

export default RevenueEventOverview;
