import { LinkProps } from "next/link";
import {
  ButtonHTMLAttributes,
  HTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SVGAttributes,
  TextareaHTMLAttributes,
} from "react";
import { SalesDataLink } from "../../lib/dashboard-sales/typings";

export interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export type PageWithTitleProps<T = {}> = {
  title: string;
} & T;

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "regular"
  | "altPrimary"
  | "secondaryAlt"
  | "outline";
export type ButtonSizeVariant = "sm" | "lg";

export type ButtonVariants = Record<ButtonVariant, string>;

export type ButtonSizeVariants = Record<ButtonSizeVariant, string>;
export type PropsWithCloseModal<T = {}> = {
  closeModal: () => void;
} & T;
export interface ButtonVariantConsumer {
  variant?: ButtonVariant;
  size?: ButtonSizeVariant;
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantConsumer {
  loading?: boolean;
}

export type ButtonLinkProps = ButtonVariantConsumer &
  LinkProps & {
    className?: string;
    children?: ReactNode;
  };

export type IconVariant = "fill" | "stroke";
export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconVariant;
  icon?: ReactNode;
  loading?: boolean;
}

export type IconVariants = Record<IconVariant, string>;

export type NavLinkProps = PropsWithChildren<LinkProps>;

type FormField<T = {}> = T & {
  label?: string | null | undefined;
  error?: string;
  noShadow?: boolean;
  children?: ReactNode;
};

type IconPosition = "left" | "right";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface FormFieldProps extends FormField<InputProps> {}

export interface FormSelectFieldProps extends FormField<SelectProps> {}

export interface FormTextareaFieldProps extends FormField<TextAreaProps> {}

type FieldSetError = string | undefined;

export interface FormFieldsetProps extends FormField {
  className?: string;
  errors?: FieldSetError[];

  replaceInputWrapperClassName?: boolean;
  inputWrapperClassName?: string;
}

interface BaseInputProps {
  icon?: ReactNode;
  iconPosition?: IconPosition;
  wrapperClassName?: string;
}

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseInputProps {}

export interface InputCheckBoxProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FormField {}

export interface SelectProps
  extends InputHTMLAttributes<HTMLSelectElement>,
    BaseInputProps {
  icon?: ReactNode;
}

export enum Device {
  xlarge = "(min-width:1200px)",
  large = "(min-width:992px)",
  medium = "(min-width:768px)",
  small = "(min-width:480px)",
}

export interface UseMediaQuery {
  (query: Device): boolean;
}

export type IconSize = "sm" | "lg";

export interface IconProps extends SVGAttributes<HTMLOrSVGElement> {
  size?: number | IconSize;
}

export type IconSizes = Record<IconSize, number>;

export interface DetailProps {
  icon: ReactNode;
  text: string;
}

export interface FooterLink {
  text: string;
  link: string;
}

export interface LinkListProps {
  links: FooterLink[];
  uppercase?: boolean;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface SearchBarProps extends InputProps {
  closeAction?: () => void;
  closeButtonShow?: boolean;
}

export type ResponseStatus = "success" | "failed";

export type HttpResponse<TData = null> = {
  data: TData;
  message?: string;
  status: ResponseStatus;
};

export interface CountryData {
  name: string;
  dial_code: string;
  code: string;
}

export interface NoContentProps extends PropsWithChildren {
  title: string;
  button?: NoContentButton;
  image?: string;
}

export interface NoContentButton {
  text: string;
  link?: string;
  variant?: ButtonVariant;
  action?: (...args: any) => void;
}

export interface RouteLoaderProps extends PropsWithChildren {
  disabled?: boolean;
}

export type AllStrings<T extends string> = {
  [key in T]: string;
};

export type SameType<T extends string, U> = {
  [key in T]: U;
};

export type AlertType = "error" | "success" | "info";

export type AlertVariants = Record<AlertType, string>;

export interface AlertMessage {
  type: AlertType;
  body: string;
  title: string;
}

export interface AlertContextValues {
  handleOpenAlert: (alert: AlertMessage) => void;
  closeAlert: (index: number) => void;
}

export interface AlertProps {
  alertMessages: AlertMessage[];
}

export interface AlertBoxProps extends AlertMessage {
  index: number;
  close?: () => void;
  className?: string;
}

export type UserAuthProvider = "local" | "google";

export type UserRole = "individual" | "organizer" | "admin";

export type UserAccountState = "pending" | "active" | "blocked";

export type AdminRole = "super_admin" | "support" | "manager";

export interface DefaultUser {
  id: string;
  completed_profile: boolean;
  avatar?: string;
  auth_provider: UserAuthProvider;
  email: "mfonisoischris@gmail.com";
  role: UserRole;
  admin_role?: AdminRole;
  country: string;
  phone_number: string;
  phone_dial_code: string;
  account_state: UserAccountState;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IndividualUser extends DefaultUser {
  first_name: string;
  last_name: string;
}

export interface AdminUser extends DefaultUser {
  first_name: string;
  last_name: string;
  admin_role: AdminRole;
  super_admin: boolean;
}

export interface OrganizerUser extends DefaultUser {
  buisness_name: string;
}

export interface ProtectedRouteProps extends PropsWithChildren {
  emailVerified?: boolean;
}

export interface AvatarProps {
  size?: number;
  image?: string;
  className?: string;
}

export interface Timezone {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}

export interface WithClickAwayActionProps {
  onClickAwayAction?: (...args: any) => void;
}

export interface PaginationData {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: number;
  links: SalesDataLink[];
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
}

export interface PaginationProps {
  hasNextPage: boolean;
  isLoading: boolean;
  hasPreviousPage: boolean;
  firstPage: () => void;
  lastPage: () => void;
  previousPage: () => void;
  nextPage: () => void;
  from: number;
  to: number;
  total: number;
}

export interface IModalProps extends HTMLProps<HTMLDivElement> {
  show?: boolean;
  cardClassName?: string;
  retain?: boolean;
  onExit?: (...args: any) => any;

  disableWarningIcon?: boolean;
}

export interface IModalRef {
  openModal: () => void;
  closeModal: () => void;
}

export interface PageHeroProps {
  title: string;
}

export interface PageSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export type IconCardProps = SameType<"icon" | "title" | "text", string> & {
  className?: string;
};

export interface SSOHeadProps extends PropsWithChildren {
  title: string;
  description: string;
  og: OgData;
}

export interface OgData {
  title?: string;
  image?: string;
  description?: string;
}
