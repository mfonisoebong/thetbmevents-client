import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Link from "next/link";
import Customer from "@lib/admin-overview/components/TopCustomers/Customer";
import useOverview from "@lib/admin-overview/hooks/useOverview";

const TopCustomers: FC = () => {
  const { data: overview } = useOverview();

  return (
    <OverviewCard theme={"light"}>
      <div className="flex justify-between items-center">
        <h5>Top customers</h5>
        <Link
          className={"text-xs font-bold text-mainBlue"}
          href={"/admin/users"}
        >
          See all
        </Link>
      </div>

      <div className="space-y-5 mt-5 ">
        {overview?.top_customers.map((c) => (
          <Customer
            name={c.name}
            email={c.email}
            key={c.id}
            id={c.id}
            avatar={c.avatar}
          />
        ))}
      </div>
    </OverviewCard>
  );
};

export default TopCustomers;
