import { AdminRole } from "@common/typings";

type AdminRolesItem = {
  role: AdminRole;
  alias: string;
};
export const adminRoles: AdminRolesItem[] = [
  {
    alias: "Super admin",
    role: "super_admin",
  },
  {
    alias: "Support staff",
    role: "support",
  },
  {
    alias: "Manager",
    role: "manager",
  },
];
