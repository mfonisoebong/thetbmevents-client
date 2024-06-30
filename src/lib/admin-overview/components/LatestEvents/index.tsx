import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Event from "@lib/admin-overview/components/LatestEvents/Event";
import useOverview from "@lib/admin-overview/hooks/useOverview";

const LatestEvents: FC = () => {
  const { data: overview } = useOverview();

  return (
    <div className={" max-h-[30rem] overflow-y-scroll overflow-x-hidden"}>
      <OverviewCard theme={"light"} title={"Latest events"}>
        <div className="mt-4 space-y-4">
          {overview?.latest_events.map((l) => (
            <Event
              logo={l.logo ?? "/images/no_event.png"}
              title={l.title}
              type={l.type}
              ticketSold={l.tickets_sold}
              key={l.id}
            />
          ))}
        </div>
      </OverviewCard>
    </div>
  );
};

export default LatestEvents;
