import { useContext } from "react";
import { EventContext } from "@lib/event/contexts/EventContext/Context";

export default function useEventContext() {
  return useContext(EventContext);
}
