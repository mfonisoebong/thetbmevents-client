import { PageWithTitleProps } from "@common/typings";
import { Event, EventData, Ticket } from "@lib/edit-event/typings";

import { ReactNode } from "react";

export interface TicketProps {
  name: string;
  id: string;
}

export interface TicketCartItem {
  quantity: number;
  id?: string;
}

export interface EventContextValues {
  event: Event;
  tickets: Ticket[];
}

export interface SocialProps {
  social?: string;
  icon: ReactNode;
  platform: string;
}

export type EventPageProps = PageWithTitleProps<EventData>;

export interface EventSlug {
  alias: string;
  id: string;
}

export interface EventProviderProps {
  event: Event;
  tickets: Ticket[];
  children: ReactNode;
}
