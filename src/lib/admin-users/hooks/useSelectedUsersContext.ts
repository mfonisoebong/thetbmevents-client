import { useContext } from "react";
import { SelectedUsersContext } from "@lib/admin-users/contexts/SelectedUsers/Context";

export default function useSelectedUsersContext() {
  return useContext(SelectedUsersContext);
}
