import IconButton from "@common/components/IconButton";
import Close from "@common/components/Icons/Close";
import Menu from "@common/components/Icons/Menu";
import useSidebarContext from "@lib/dashboard/hooks/useSidebarContext";
import { FC } from "react";

const MenuBar: FC = () => {
  const { toggleShowSidebar, showSidebar } = useSidebarContext();

  const icon = showSidebar ? (
    <Close className="fill-black" size={20} />
  ) : (
    <Menu className="fill-black" size={20} />
  );

  return (
    <div className="w-1/12 absolute left-0 top-1/2">
      <IconButton onClick={toggleShowSidebar} icon={icon} variant="fill" />
    </div>
  );
};

export default MenuBar;
