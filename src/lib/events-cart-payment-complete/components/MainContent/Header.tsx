import { FC } from "react";
import styles from "./styles.module.css";
import Image from "next/image";

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerimg}>
        <Image src={"/images/ok.svg"} alt={"okay"} width={70} height={70} />
      </div>
      <div>
        <h3>Payment successful</h3>
        <p>
          You will receive an order confirmation mail with details of your
          ticket
        </p>
      </div>
    </div>
  );
};

export default Header;
