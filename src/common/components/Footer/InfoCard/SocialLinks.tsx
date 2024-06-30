import Facebook from "@common/components/Icons/Facebook";
import Instagram from "@common/components/Icons/Instagram";
import Twitter from "@common/components/Icons/Twitter";
import { FC } from "react";
import styles from "../styles.module.css";

const SocialLinks: FC = () => {
  return (
    <div className={styles.sociallinks}>
      <a href="" target="_blank">
        <Facebook color="white" size={22} />
      </a>
      <a href="https://twitter.com/EventwithTBM" target="_blank">
        <Twitter color="white" size={22} />
      </a>
      <a href="https://www.instagram.com/eventswithtbm" target="_blank">
        <Instagram color="white" size={22} />
      </a>
    </div>
  );
};

export default SocialLinks;
