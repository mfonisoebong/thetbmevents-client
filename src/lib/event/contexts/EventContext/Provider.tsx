import { FC } from "react";
import { EventContext } from "@lib/event/contexts/EventContext/Context";
import { EventProviderProps } from "@lib/event/typings";

const EventProvider: FC<EventProviderProps> = ({
  children,
  event,
  tickets,
}) => {
  return (
    <EventContext.Provider
      value={{
        event,
        tickets,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
