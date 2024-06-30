import { FC } from "react";
import styles from "@lib/admin-overview/components/RevenueEventOverview/styles.module.css";
import { RevenueCardProps } from "@lib/admin-overview/typings";
import { numberFormatter } from "@common/utils/numberFormatter";

const Card: FC<RevenueCardProps> = ({ value, title }) => {
  return (
    <div className={styles.cardinner}>
      <div className={styles.cardinnerheader}>
        <h6>{title}</h6>
      </div>
      <h3>₦{numberFormatter(value, 2)}</h3>
    </div>
  );
};
export default Card;
