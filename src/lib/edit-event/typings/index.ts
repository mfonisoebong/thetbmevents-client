export type EventType = "physical" | "virtual";
export interface Event {
  id: string;
  title: string;
  description: string;
  currency: "NGN" | "USD";
  event_link: string;
  location_tips?: string;
  timezone: string;
  type: EventType;
  location: string;
  user_id: string;
  attendees: number;
  event_date: string;
  event_time?: string;
  links_instagram?: string;
  links_twitter?: string;
  links_facebook?: string;
  undisclose_location: boolean;
  logo: string;
  categories: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  name: string;
  price: number;
  unlimited: boolean;
  quantity: number;
  created_at: string;
  description?: string;
  selling_start_date_time: string;
  selling_end_date_time: string;
  is_early: boolean;
  is_late: boolean;
  is_sold_out: boolean;
  sold: number;
  updated_at: string;
}

export interface EventData {
  event: Event;
  tickets: Ticket[];
}
