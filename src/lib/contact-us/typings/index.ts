import { PropsWithChildren, ReactNode } from "react";

export interface CardProps extends PropsWithChildren {
  icon: ReactNode;
  title: string;
}
