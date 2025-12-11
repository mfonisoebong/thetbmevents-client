import { PropsWithChildren } from "react";
import { Ticket } from "@lib/edit-event/typings";
import { AttendeeFormType } from "@lib/event-checkout/utils/contactInformationSchema";

export interface SelectedTicket {
  id: string;
  quantity: number;
}

export interface SelectedTicketProps {
  ticket: SelectedTicket;
}

export interface TicketsContextValues {
  selectedTickets: SelectedTicket[];
  incrementQuantity: (id: string, maxQuantity?: number) => void;
  decrementQuantity: (id: string) => void;
}

export interface CommonCardProps extends PropsWithChildren {
  title: string;
}

export interface LayoutContainerProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export interface TicketProps {
  ticket: Ticket;
}

export interface TicketDetailsProps {
  name: string;
  price: number;
  description?: string;
  isEarly: boolean;
  isLate: boolean;
  salesStart: string;
  salesEnd: string;
  isSoldOut: boolean;
  sold: number;
  quantity: number;
}

export interface ContinueProps {
  disabled?: boolean;
  onClick: () => void;
}

export interface AttendeeFormProps {
  index: number;
  ticket: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface AttendeeMainForm {
  ticketId: string;
  index: number;
}

export type PaymentGateway = "vella" | "paystack" | "flutterwave" | null;

export type PaymentData = {
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone_dial_code: string;
  customer_phone_number: string;
  attendees: AttendeeFormType[];
  tickets: SelectedTicket[];
  couponCode?: string;
};

export interface QuantitySelectProps {
  quantity: number;
  increment: () => void;
  decrement: () => void;
  disabled?: boolean;
}
