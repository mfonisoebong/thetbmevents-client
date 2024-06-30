import { FC } from "react";
import styles from "./styles.module.css";
import useTotalAmount from "@lib/event-checkout/hooks/useTotalAmount";

const FeesSubtotal: FC = () => {
  const { totalAmount } = useTotalAmount();

  return (
    <div className={styles.fees}>
      <div className={"flex justify-between"}>
        <p>Fees</p>
        <h5>NGN 0.00</h5>
      </div>
      <div className={"flex justify-between"}>
        <p>Subtotal</p>
        <h5>NGN {totalAmount.toLocaleString()}</h5>
      </div>
    </div>
  );
};

export default FeesSubtotal;
