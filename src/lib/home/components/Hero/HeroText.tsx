import { FC } from "react";
import Image from "next/image";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import styles from "./styles.module.css";

const HeroText: FC = () => {
  const isLargeDevice = useMediaQuery(Device.large);
  const isMediumDevice = useMediaQuery(Device.medium);
  const imageSize = isLargeDevice ? 300 : isMediumDevice ? 120 : 100;

  return (
    <div className={styles.hero}>
      <h1>
        Find Amazing Events happening in{" "}
        <span>
          <Image
            src="/images/home_hero_1.png"
            alt="Celebration"
            width={imageSize}
            height={80}
          />
        </span>{" "}
        Your{" "}
        <Image
          src="/images/home_hero_1.png"
          alt="Celebration"
          width={imageSize}
          height={80}
        />{" "}
        city.
      </h1>
      <h3>
        Discover Unforgettable Experiences: Your Gateway to Exclusive Events and
        Seamless Ticketing!
      </h3>
    </div>
  );
};

export default HeroText;
