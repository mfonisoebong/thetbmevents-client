import { FC } from "react"
import { MenuItemsProps } from "@lib/admin-users/typings"
import IconButton from "@common/components/IconButton"
import Ellipsis from "@common/components/Icons/Ellipsis"
import useToggle from "@common/hooks/useToggle"
import optionstyles from "@lib/admin-dashboard/components/Select/styles.module.css"
import { twMerge } from "tailwind-merge"
import Link from "next/link"
import styles from "./styles.module.css"
import useOrganizers from "@lib/admin-organizers/hooks/useOrganizers"
import useChangeUserStatus from "@lib/admin-dashboard/hooks/useChangeUserStatus"
const MenuItems: FC<MenuItemsProps> = ({ id, status }) => {
  const { toggle, handleToggle } = useToggle()
  const c = twMerge(optionstyles.options, styles.menuoptions)
  const { refetch } = useOrganizers()

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
          <Link href={`/admin/event-organizers/${id}`}>Edit</Link>
          {status && (
            <button
              disabled={isLoading}
              className="disabled:opacity-50"
              onClick={isActive ? deactivateUser : activateUser}
            >
              {isActive ? "Deactivate" : "Activate"}
            </button>
          )}
          <Link href={`/admin/login-as/${id}`}>Login As</Link>
        </div>
      )}
    </div>
  )
}

export default MenuItems
