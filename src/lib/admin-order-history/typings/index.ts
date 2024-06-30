import { PaginationData } from "@common/typings";

export interface OrderHistory {
  id: number;
  ticket_no: string;
  event_name: string;
  ticket_name: string;
  ticket_price: number;
  organizer: string;
  created_at: string;
}

export interface OrderHistoryData extends PaginationData {
  data: OrderHistory[];
}
export interface OrdersPaginationProps {
  data: OrderHistoryData;
}

export interface TableRowProps extends OrderHistory {}
