import { Event, Ticket } from "@lib/edit-event/typings";
import { TicketFormType } from "@lib/create-event/utils/eventSchema";
import { PropsWithChildren } from "react";
export interface ControlsProps {
  onNext?: () => void;
  moveToMext?: boolean;
}

export interface TicketsProps {
  addTicket: () => void;
}

export interface TicketFormProps {
  closeForm: () => void;
}

export interface FormSetProps extends TicketFormProps {}

export type TicketRowProps = {
  index: number;
} & TicketFormType;

export interface EventFormProps {
  event?: Event;
  tickets?: Ticket[];
}

export type FormContainerProps = PropsWithChildren<{
  className?: string;
}>;

export type SectionHeaderProps = {
  heading: string;
  closeLink: string;
};
