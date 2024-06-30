import { PropsWithChildren } from "react";

export interface Feature {
  id: number;
  title: string;
  thumbnail: string;
}

export interface FeatureHeading {
  heading: string;
  sub_heading: string;
}

export interface FeaturesData {
  heading: FeatureHeading | null;
  features: Feature[];
}

export interface FeaturesFormProviderProps extends PropsWithChildren {
  featuresData: FeaturesData;
}

export interface FeatureFormProps {
  index: number;
}
