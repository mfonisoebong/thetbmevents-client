import { FC } from "react";
import styles from "../../styles.module.css";
import Link from "next/link";
import ArrowUp from "@common/components/Icons/ArrowUp";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { EventLinkProps } from "@lib/home/typings";

const EventLink: FC<EventLinkProps> = ({ eventId }) => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 28 : 15;

  return (
    <div className={`${styles.card} w-max mx-auto md:mx-0 `}>
      <Link
        href={`/events/${eventId}`}
        target="_blank"
        className="flex space-x-2 font-bold text-xs md:text-lg lg:text-2xl  w-full items-center"
      >
        <p>Attend The Event</p>
        <ArrowUp color="black" size={iconSize} className="rotate-45" />
      </Link>
    </div>
  );
};
export default EventLink;
