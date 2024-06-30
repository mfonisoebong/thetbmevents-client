import { FC } from "react";
import styles from "./styles.module.css";
import AccountCard from "./AccountCard";

const AccountTypeSelection: FC = () => {
  return (
    <div className={styles.selectionbox}>
      <div className={styles.badge}>or</div>
      <AccountCard account="individual" />
      <AccountCard account="organizer" />
    </div>
  );
};

export default AccountTypeSelection;
