import { createContext } from "react";
import { TicketsContextValues } from "@lib/event-checkout/typings";

export const TicketsContext = createContext({} as TicketsContextValues);
