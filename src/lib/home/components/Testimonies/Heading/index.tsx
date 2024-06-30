import { FC } from "react";
import styles from "../styles.module.css";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const Heading: FC = () => {
  const { testimonies } = useHomeContext();

  return (
    <div className={styles.heading}>
      <h2>{testimonies.heading}</h2>
      <h3>{testimonies.sub_heading}</h3>
    </div>
  );
};

export default Heading;
