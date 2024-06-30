import { FC } from "react"
import { MenuItemsProps } from "@lib/admin-users/typings"
import IconButton from "@common/components/IconButton"
import Ellipsis from "@common/components/Icons/Ellipsis"
import useToggle from "@common/hooks/useToggle"
import optionstyles from "@lib/admin-dashboard/components/Select/styles.module.css"
import { twMerge } from "tailwind-merge"
import Link from "next/link"
import styles from "./styles.module.css"
import useChangeUserStatus from "@lib/admin-dashboard/hooks/useChangeUserStatus"
import useAdmins from "@lib/admin-admins/hooks/useAdmins"

const MenuItems: FC<MenuItemsProps> = ({ id, status }) => {
  const { toggle, handleToggle } = useToggle()
  const c = twMerge(optionstyles.options, styles.menuoptions)
  const { refetch } = useAdmins()

  const isActive = status === "active"

  const {
    activateUser,
    deactivateUser,
    mutation: { isLoading },
  } = useChangeUserStatus({
    id,
    onSuccess: refetch,
  })

  return (
    <div className={"relative"}>
      <IconButton onClick={handleToggle} icon={<Ellipsis color={"black"} />} />
      {toggle && (
        <div className={c}>
          <button
            disabled={isLoading}
            className="disabled:opacity-50"
            onClick={isActive ? deactivateUser : activateUser}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}
    </div>
  )
}

export default MenuItems
