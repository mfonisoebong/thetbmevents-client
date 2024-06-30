import { SidebarLinkProps } from "@lib/dashboard/typings";
import {
  AdminRole,
  AdminUser,
  IndividualUser,
  OrganizerUser,
} from "@common/typings";

export const organizerLinks: SidebarLinkProps[] = [
  {
    href: "/organizer/dashboard",
    text: "Overview",
  },
  {
    href: "/organizer/dashboard/events",
    text: "Events",
  },
  {
    href: "/organizer/dashboard/sales",
    text: "Sales",
  },
  {
    href: "/organizer/dashboard/finance",
    text: "Finance",
  },
  {
    href: "/events/scan",
    text: "Scan Tickets",
  },
];

export const individualLinks: SidebarLinkProps[] = [
  {
    href: "/dashboard/tickets",
    text: "Tickets",
  },
];

export const allAdminLinks: SidebarLinkProps[] = [
  {
    href: "/admin/overview",
    text: "Overview",
  },
  {
    href: "/admin/users",
    text: "Users",
  },
  {
    href: "/admin/event-organizers",
    text: "Event Organizer",
  },
  {
    href: "/admin/staffs",
    text: "Staff",
  },
  {
    href: "/admin/slider",
    text: "Slider",
  },
  {
    href: "/admin/features",
    text: "Features",
  },
  {
    href: "/admin/categories",
    text: "Categories",
  },
  {
    href: "/admin/testimonies",
    text: "Testimonies",
  },
  {
    href: "/admin/order-history",
    text: "Order History",
  },
  {
    href: "/admin/finances",
    text: "Finances",
  },
  {
    href: "/admin/newsletters",
    text: "Newsletter",
  },
  {
    href: "/admin/payment-method",
    text: "Payment method",
  },
];

export const supportAdminLinks: SidebarLinkProps[] = [
  {
    href: "/admin/event-organizers",
    text: "Event Organizer",
  },
  {
    href: "/admin/users",
    text: "Users",
  },
  {
    href: "/admin/order-history",
    text: "Order History",
  },
  {
    href: "/admin/testimonies",
    text: "Testimonies",
  },
];

export const managerAdminLinks: SidebarLinkProps[] = [
  {
    href: "/admin/overview",
    text: "Overview",
  },
  {
    href: "/admin/finances",
    text: "Finances",
  },
  {
    href: "/admin/newsletters",
    text: "Newsletter",
  },
  {
    href: "/admin/categories",
    text: "Categories",
  },
  {
    href: "/admin/payment-method",
    text: "Payment method",
  },
  {
    href: "/admin/slider",
    text: "Slider",
  },
  {
    href: "/admin/features",
    text: "Features",
  },
];

export const sidebarLinks = (
  user?: IndividualUser | OrganizerUser | AdminUser,
): SidebarLinkProps[] => {
  if (!user) return [];

  if (user?.role === "individual") return individualLinks;

  if (user?.role === "organizer") return organizerLinks;

  if (!user.admin_role) return [];

  const adminLinkObj: Record<AdminRole, SidebarLinkProps[]> = {
    super_admin: allAdminLinks,
    manager: managerAdminLinks,
    support: supportAdminLinks,
  };

  return adminLinkObj[user.admin_role];
};
