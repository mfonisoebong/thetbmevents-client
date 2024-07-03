import { PaginationData } from "@common/typings";
import { SalesData } from "@lib/dashboard-sales/typings";

export interface Coupon {
  id: string;
  name: string;
  code: string;
  start_date_time: string;
  end_date_time: string;
  type: "fixed" | "percentage";
  value: number;
  event: string;
  status: "active" | "inactive";
  event_id: string;
}

export interface CouponsData extends PaginationData {
  data: Coupon[];
}

export interface ITableRowProps {
  coupon: Coupon;
}

export interface ICouponFormProps {
  coupon?: Coupon;
}
