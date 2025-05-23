import Close from "@common/components/Icons/Close";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Link from "next/link";
import { FC } from "react";
import styles from "./styles.module.css";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { useRouter } from "next/router";
import { SectionHeaderProps } from "@lib/create-event/typings";

const SectionHeader: FC<SectionHeaderProps> = ({ heading, closeLink }) => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 19 : 15;
  const { pathname } = useRouter();

  return (
    <OverviewCard theme="light">
      <div className={styles.header}>
        <h3>{heading}</h3>
        <Link href={closeLink}>
          <Close size={iconSize} />
          <span>Close</span>
        </Link>
      </div>
    </OverviewCard>
  );
};

export default SectionHeader;
