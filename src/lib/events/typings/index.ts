import { PropsWithChildren } from "react";

export interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
  alias: string;
  logo?: string;
  undisclose_location: boolean;
}

export interface FilteredEventsData {
  events: Event[];
  perPage: number;
  currentPage: number;
  total: number;
  lastPage: number;
}

export interface Category {
  id: number;
  category: string;
}

export interface EventData {
  top_events: Event[];
  popular: {
    free: Event[];
    paid: Event[];
    online: Event[];
  };
  latest_events: Event[];
}

export interface LocationEvents {
  city: Event[];
  country: Event[];
  user_info: {
    city: string;
    country: string;
  };
}

export interface EventPageProps extends EventData {}

export interface FilterQueryOptions {
  search?: string;
  location?: string;
  date?: string;
  category?: string;
  page?: string;
}

export interface SectionProps extends PropsWithChildren {
  title: string;
}

export interface EventsProviderProps extends PropsWithChildren {
  eventData: EventData;
}

export interface EventsContextValues {
  eventData: EventData;
}

export interface TopEventProps extends Pick<Event, "id" | "title" | "logo"> {}

export interface EventsProps {
  events: Event[];
  category?: string;
}

export interface EventCardProps extends Event {
  filtered?: boolean;
}
