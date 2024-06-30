export type Option = string | number;
export interface SelectProps {
  className?: string;
  options: Option[];
  optionsDisplay?: Option[];
  onSelect: (...args: any) => void;
  selectedOption?: string;
}

export type OptionsProps = SelectProps & {
  onClickAway?: () => void;
};

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
}

export interface HeadingProps {
  title: string;
}
