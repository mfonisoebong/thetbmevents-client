import { FC } from "react";
import { EventsProps } from "@lib/events/typings";
import EventCard from "./EventCard";
import SlideShow from "@common/components/SlideShow";
import useWindowSize from "@common/hooks/useWindowSize";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Link from "next/link";
import styles from "./styles.module.css";
import ArrowRight from "@common/components/Icons/ArrowRight";
import { useRouter } from "next/router";

const Events: FC<EventsProps> = ({ events, category }) => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const isLargeDevice = useMediaQuery(Device.large);
  const items = isLargeDevice ? 3 : isMediumDevice ? 2 : 1;
  const router = useRouter();

  return (
    <>
      <SlideShow itemsPerPage={items} iconsColor="black">
        {events.map((e) => (
          <EventCard key={e.id} {...e} />
        ))}
      </SlideShow>

      {category && (
        <div className={styles.seemore}>
          <Link href={`/events?category=${category}`}>
            <span>See more</span>
            <ArrowRight />
          </Link>
        </div>
      )}
    </>
  );
};

export default Events;
