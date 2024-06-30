import { PaginationData } from "@common/typings";

export interface Customer {
  name: string;
  email: string;
}

export interface SalesData extends PaginationData {
  data: Sale[];
}

export interface SalesPaginationProps {
  data: SalesData;
}

export interface SalesDataLink {
  url: string | null;
  label: string;
  active: boolean;
}
export interface Sale {
  id: string;
  created_at: Date;
  tickets_bought: number;
  price: number;
  ticket: string;
  customer: Customer;
}

export interface TableRowProps extends Sale {}
