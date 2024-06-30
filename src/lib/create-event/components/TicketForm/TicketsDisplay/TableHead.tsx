import { FC } from "react";
import styles from "./styles.module.css";

const TableHead: FC = () => {
  return (
    <thead>
      <tr className={styles.tablehead}>
        <th>ticket name</th>
        <th>ticket price</th>
      </tr>
    </thead>
  );
};

export default TableHead;
