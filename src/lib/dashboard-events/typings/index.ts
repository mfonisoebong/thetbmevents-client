export interface SelectEventTypeProps {
  closeModal: () => void;
}

export interface UserEvent {
  id: string;
  title: string;
  logo: string;
  alias: string;
  created_at: string;
  ticket_price: number;
}

export interface TableRowProps extends UserEvent {}

export interface EventOptionsProps {
  id: string;
  showOptions: boolean;
  toggleShowOptions: () => void;
}
