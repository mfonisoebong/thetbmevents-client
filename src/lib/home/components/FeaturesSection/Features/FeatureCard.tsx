import { FeatureCardProps } from "@lib/home/typings";
import { FC } from "react";
import styles from "../styles.module.css";

const FeatureCard: FC<FeatureCardProps> = (props) => {
  return (
    <div
      className={styles.offercard}
      style={{
        background: `url('${props.thumbnail}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <h3 className="text-white font-bold text-lg md:text-2xl w-7/12 md:w-6/12 ">
        {props.title}
      </h3>
    </div>
  );
};

export default FeatureCard;
