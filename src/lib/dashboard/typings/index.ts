import { PropsWithChildren } from "react";
import { AdminRole } from "@common/typings";

export interface SidebarLinkProps {
  href: string;
  text: string;
}

export interface SidebarContextValues {
  showSidebar: boolean;
  toggleShowSidebar: () => void;
  showNotifications: boolean;
  toggleShowNotifications: () => void;
}

export interface DashboardHeadProps extends PropsWithChildren {
  title?: string;
}

export interface DashboardTabsProps {
  tabs: string[];
  activeTab: string;
}

export interface Tab {
  tab: string;
}

export interface DashboardTabsContextValues {
  tabState: TabState;
  changeTabPosition: (pos: string | number) => void;
}

export interface DashboardProviderProps extends PropsWithChildren {
  tabs: string[];
}

export interface TabState extends DashboardTabsProps {}

export interface Notification {
  unread: boolean;
  id: string;
  body: string;
  created_at: string;
}

export interface HeadiingProps {
  title: string;
}

export interface RedirectUserProps {
  page: "organizer" | "admin" | "user";
  admin?: AdminRole;
}
