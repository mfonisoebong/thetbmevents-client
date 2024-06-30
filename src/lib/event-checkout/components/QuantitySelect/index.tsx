import { FC } from "react";
import styles from "./styles.module.css";
import { QuantitySelectProps } from "@lib/event-checkout/typings";

const QuantitySelect: FC<QuantitySelectProps> = (props) => {
  return (
    <div className={styles.counter}>
      <button disabled={props.disabled} onClick={props.decrement}>
        -
      </button>
      <span>{props.quantity}</span>
      <button disabled={props.disabled} onClick={props.increment}>
        +
      </button>
    </div>
  );
};

export default QuantitySelect;
