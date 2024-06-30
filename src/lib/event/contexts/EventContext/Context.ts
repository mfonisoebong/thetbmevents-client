import { createContext } from "react";
import { EventContextValues } from "@lib/event/typings";

export const EventContext = createContext({} as EventContextValues);
