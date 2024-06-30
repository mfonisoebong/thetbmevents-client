import { FC } from "react";
import { MenuItemsProps } from "@lib/admin-users/typings";
import IconButton from "@common/components/IconButton";
import Ellipsis from "@common/components/Icons/Ellipsis";
import useToggle from "@common/hooks/useToggle";
import optionstyles from "@lib/admin-dashboard/components/Select/styles.module.css";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import styles from "./styles.module.css";
const MenuItems: FC<MenuItemsProps> = ({ id }) => {
  const { toggle, handleToggle } = useToggle();
  const c = twMerge(optionstyles.options, styles.menuoptions);

  return (
    <div className={"relative"}>
      <IconButton onClick={handleToggle} icon={<Ellipsis color={"black"} />} />
      {toggle && (
        <div className={c}>
          <Link href={`/admin/users/${id}`}>View</Link>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
