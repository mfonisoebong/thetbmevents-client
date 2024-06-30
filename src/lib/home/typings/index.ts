import { PropsWithChildren } from "react";
import { PanInfo } from "framer-motion";
import { SameType } from "@common/typings";

export interface SlideShowProps extends PropsWithChildren {
  iconsColor?: string;
  itemsPerPage?: number;
  height?: string | number;
}

export interface PageIndicatorProps {
  active: number;
  items: number;
  toPage: (num: number) => void;
}

export interface UseSlideShow {
  (pages: number): {
    page: number;
    direction: number;
    paginate: (newDirection: number) => void;
    onDragEnd:
      | ((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void)
      | undefined;
    toPage: (num: number) => void;
  };
}

export interface Review {
  id: number;
  avatar: string;
  name: string;
  body: string;
  source: TestimonyItem["channel"];
}

export type ReviewCardProps = Omit<Review, "id">;

export interface Offer {
  image: string;
  id: number;
  title: string;
}

export type OfferCardProps = Omit<Offer, "id">;

export interface HomePageData {
  features: FeaturesData;
  upcoming_events: UpcomingEvent[];
  testimonies: TestimoniesData;
}

export interface UpcomingEvent {
  id: number;
  event_logo: string;
  event_alias: string
  event_id: string;
  expire_in: ExpireIn;
  ticket: Ticket;
}

export type ExpireIn = SameType<
  "y" | "m" | "d" | "h" | "i" | "s" | "f",
  number
>;

export interface Ticket {
  name: string;
  price: number;
}

export interface AttendAnEventProps {
  event: UpcomingEvent;
}
export interface TimeRemainingProps {
  expireIn: ExpireIn;
  ticketPrice: number;
}

export interface EventLinkProps {
  eventId: string;
}

export interface HomeContextValues extends HomePageData {}

export interface FeatureItem {
  id: number;
  title: string;
  thumbnail: string;
}

export interface TestimonyItem {
  id: number;
  name: string;
  channel: "facebook" | "twitter" | "instagram";
  avatar: string;
  description: string;
}

type PageDataWithHeaders<T> = {
  heading: string;
  sub_heading: string;
  items: T;
};
export type FeaturesData = PageDataWithHeaders<FeatureItem[]>;
export type TestimoniesData = PageDataWithHeaders<TestimonyItem[]>;
export interface FeatureCardProps extends FeatureItem {}
export interface HomeProviderProps extends PropsWithChildren, HomePageData {}
