import { SameType } from "@common/typings";
import { PropsWithChildren } from "react";

export type Channel = "facebook" | "twitter" | "instagram";
export interface Testimony {
  name: string;
  description: string;
  avatar: string;
  channel: Channel;
  id: number;
}

export type Heading = SameType<"heading" | "sub_heading", string>;
export interface TestimoniesData {
  testimonies: Testimony[];
  heading?: Heading;
}

export interface TestimoniesFormProviderProps extends PropsWithChildren {
  testimoniesData: TestimoniesData;
}

export interface ChannelProps {
  channel: Channel;
  index: number;
}
