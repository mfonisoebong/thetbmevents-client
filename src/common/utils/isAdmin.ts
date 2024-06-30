import { IndividualUser, OrganizerUser, AdminUser } from "@common/typings";

export const isAdmin = (
  user: IndividualUser | OrganizerUser | AdminUser | undefined,
): user is AdminUser => {
  return user?.role === "admin";
};
