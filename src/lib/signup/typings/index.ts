export type AccountType = "individual" | "organizer" | "admin";

export interface AccountCardProps {
  account: AccountType;
}

export interface IAccountSelectionContext {
  account: AccountType;
  changeAccount: (account: AccountType) => void;
}
