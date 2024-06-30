import { createContext } from "react";
import { SelectedUsersContextValues } from "@lib/admin-users/typings";

export const SelectedUsersContext = createContext(
  {} as SelectedUsersContextValues,
);
