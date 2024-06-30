import {
  AdminUser,
  IndividualUser,
  OrganizerUser,
  UserRole,
} from "@common/typings"

export const dashboardLink = (
  user?: AdminUser | OrganizerUser | IndividualUser
): string => {
  const url: Record<UserRole, string> = {
    admin: "/admin/overview",
    individual: "/dashboard/tickets",
    organizer: "/organizer/dashboard",
  }

  if (!user) return ""

  return url[user.role]
}
