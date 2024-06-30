import Close from "@common/components/Icons/Close";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.css";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { useRouter } from "next/router";

const SectionHeader: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 19 : 15;
  const { pathname } = useRouter();

  const headiing =
    pathname === "/organizer/dashboard/events/create"
      ? "Create an event"
      : "Edit event";

  return (
    <OverviewCard theme="light">
      <div className={styles.header}>
        <h3>{headiing}</h3>
        <Link href="/organizer/dashboard/events">
          <Close size={iconSize} />
          <span>Close</span>
        </Link>
      </div>
    </OverviewCard>
  );
};

export default SectionHeader;
