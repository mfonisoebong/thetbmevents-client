import { FC } from "react";
import styles from "../styles.module.css";
import { OverviewDataProps } from "@lib/admin-overview/typings";
import { twMerge } from "tailwind-merge";
import { numberFormatter } from "@common/utils/numberFormatter";
const OverviewData: FC<OverviewDataProps> = ({ title, className, value }) => {
  const c = twMerge(className, styles.overviewdata);

  return (
    <div className={c}>
      <h6>{title}</h6>
      <h3>{numberFormatter(value, 0)}</h3>
    </div>
  );
};

export default OverviewData;
