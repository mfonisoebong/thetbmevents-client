import { CSSProperties, PropsWithChildren } from "react";

export interface OverviewCardProps extends PropsWithChildren {
  title?: string;
  className?: string;
  theme: "light" | "black";
  styles?: CSSProperties;
}

export interface OverviewEarnings {
  amount: number;
  sales: number;
}

export interface CommisionAndProfit {
  commision: number;
  profit: number;
  rate: number;
}

export interface RevenueData {
  commision: number;
  profit: number;
}
export interface Overview {
  events: number;
  tickets_sold: number;
  earnings: OverviewEarnings;
  commision: number;
  commision_and_profit: CommisionAndProfit;
  revenue: RevenueData[];
}
