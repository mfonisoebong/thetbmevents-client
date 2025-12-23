import { FC } from "react";
import styles from "./styles.module.css";
import useTotalAmount from "@lib/event-checkout/hooks/useTotalAmount";

const TotalAmount: FC = () => {
  const { subtotal } = useTotalAmount();

  return (
    <div className={styles.checkout}>
      <div className={styles.total}>
        <h4>Total</h4>
        <h4>NGN {subtotal}</h4>
      </div>
    </div>
  );
};

export default TotalAmount;
