import ButtonLink from "@common/components/ButtonLink";
import { FC } from "react";
import styles from "./styles.module.css";

const HeroLinks: FC = () => {
  return (
    <div className={styles.herolinks}>
      <ButtonLink size="lg" href="/events" variant="secondary">
        Find your next event
      </ButtonLink>
      <ButtonLink size="lg" href="/signup/organizer" variant="primary">
        Create an event
      </ButtonLink>
    </div>
  );
};

export default HeroLinks;
