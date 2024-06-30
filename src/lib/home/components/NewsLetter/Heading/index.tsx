import { FC } from "react";
import styles from "../styles.module.css";

const Heading: FC = () => {
  return (
    <div className={styles.heading}>
      <h2>Subscribe to our newsletter today</h2>
      <h3>Stay In the Loop with Our Exclusive Updates</h3>
    </div>
  );
};

export default Heading;
