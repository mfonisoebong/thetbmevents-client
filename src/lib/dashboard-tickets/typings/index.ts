export interface PurchasedTicket {
  id: string;
  event: string;
  date_purchased: Date;
  ticket: string;
  used: boolean;
  price: number;
  quantity: number;
}


export interface TableRowProps
  extends Pick<PurchasedTicket, "id" | "event" | "ticket" | "date_purchased"> {}
