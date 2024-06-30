import { FC } from "react";
import SlideShow from "../../../../../common/components/SlideShow";
import { REVIEWS } from "../../../constants/reviews";
import TestimonyCard from "./TestimonyCard";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import useHomeContext from "@lib/home/hooks/useHomeContext";

const Slides: FC = () => {
  const isLargeScreen = useMediaQuery(Device.large);
  const isMediumScreen = useMediaQuery(Device.medium);
  const slidesPerPage = isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
  const { testimonies } = useHomeContext();

  return (
    <SlideShow iconsColor="black" itemsPerPage={slidesPerPage}>
      {testimonies.items.map((t) => (
        <TestimonyCard
          key={t.id.toString()}
          avatar={t.avatar}
          body={t.description}
          name={t.name}
          source={t.channel}
        />
      ))}
    </SlideShow>
  );
};

export default Slides;
