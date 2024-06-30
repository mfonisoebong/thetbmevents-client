import Container from "@common/components/Container";
import { FC } from "react";
import Heading from "./Heading";
import Slides from "./Slides";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const Testimonies: FC = () => {
  const { testimonies } = useHomeContext();

  if (testimonies.items.length === 0) {
    return null;
  }

  return (
    <section>
      <Container>
        <Heading />
        <Slides />
      </Container>
    </section>
  );
};

export default Testimonies;
