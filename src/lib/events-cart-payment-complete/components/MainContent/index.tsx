import { FC } from "react";
import styles from "./styles.module.css";
import Header from "@lib/events-cart-payment-complete/components/MainContent/Header";
import RedirectLinks from "@lib/events-cart-payment-complete/components/MainContent/RedirectLinks";
const MainContent: FC = () => {
  return (
    <div className={styles.box}>
      <Header />
      <RedirectLinks />
    </div>
  );
};

export default MainContent;
