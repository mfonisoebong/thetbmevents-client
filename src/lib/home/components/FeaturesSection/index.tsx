import { FC } from "react";
import Heading from "./Heading";
import Features from "./Features";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const FeaturesSection: FC = () => {
  const { features } = useHomeContext();

  if (features.items.length === 0) {
    return null;
  }

  return (
    <section>
      <Heading />
      <Features />
    </section>
  );
};

export default FeaturesSection;
