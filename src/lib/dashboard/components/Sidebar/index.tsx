import { FC } from "react";
import SidebarLinks from "./SidebarLinks";
import SocialLinks from "./SocialLinks";
import useSidebarContext from "@lib/dashboard/hooks/useSidebarContext";
import { twMerge } from "tailwind-merge";

const Sidebar: FC = () => {
  const { showSidebar } = useSidebarContext();

  const showClass = twMerge(
    "fixed z-40 lg:relative lg:block bg-white h-full w-[70%] md:w-[45%] lg:w-[calc(5rem+17vw)] px-8 py-12 space-y-7",
    showSidebar ? "" : "hidden",
  );

  return (
    <div className={showClass}>
      <SidebarLinks />
      <SocialLinks />
    </div>
  );
};

export default Sidebar;
