import { FC } from "react";
import useEventContext from "@lib/event/hooks/useEventContext";

const Details: FC = () => {
  const event = useEventContext();

  return (
    <div className={"space-y-5 lg:w-9/12"}>
      <h1 className={"text-xl md:text-3xl lg:text-5xl font-bold"}>
        {event.event.title}
      </h1>
      <div
        className={"text-sm md:text-base lg:text-2xl"}
        dangerouslySetInnerHTML={{
          __html: event.event.description,
        }}
      />
    </div>
  );
};

export default Details;
