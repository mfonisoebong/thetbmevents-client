import { FC } from "react";
import Image from "next/image";
import useEventContext from "@lib/event/hooks/useEventContext";

const EventImage: FC = () => {
  const event = useEventContext();

  return (
    <section>
      <Image
        src={event.event.logo}
        alt={event.event.title}
        width={600}
        height={300}
        className={
          "w-full object-cover h-[10rem] md:h-[20rem] lg:h-[30rem] rounded-xl md:rounded-2xl"
        }
      />
    </section>
  );
};

export default EventImage;
