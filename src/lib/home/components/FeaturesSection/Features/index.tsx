import { FC } from "react";
import styles from "../styles.module.css";
import FeatureCard from "./FeatureCard";
import Container from "@common/components/Container";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const Features: FC = () => {
  const { features } = useHomeContext();

  return (
    <Container>
      <div className={styles.offers}>
        {features.items.map((f) => (
          <FeatureCard {...f} key={f.id} />
        ))}
      </div>
    </Container>
  );
};

export default Features;
