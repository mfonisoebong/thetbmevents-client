import Container from "@common/components/Container";
import { FC } from "react";
import HeroText from "./HeroText";
import HeroLinks from "./HeroLinks";

const Hero: FC = () => {
  return (
    <section>
      <Container className="space-y-10">
        <HeroText />
        <HeroLinks />
      </Container>
    </section>
  );
};

export default Hero;
