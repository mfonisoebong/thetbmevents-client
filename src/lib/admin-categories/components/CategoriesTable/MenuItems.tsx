import { FC } from "react"
import { MenuItemsProps } from "@lib/admin-users/typings"
import IconButton from "@common/components/IconButton"
import Ellipsis from "@common/components/Icons/Ellipsis"
import useToggle from "@common/hooks/useToggle"
import optionstyles from "@lib/admin-dashboard/components/Select/styles.module.css"
import { twMerge } from "tailwind-merge"
import styles from "./styles.module.css"
import { useMutation } from "@tanstack/react-query"
import { deleteCategory } from "@lib/admin-categories/helpers/deleteCategory"
import useCategories from "@lib/admin-categories/hooks/useCategories"
import useAlertContext from "@common/hooks/useAlertContext"
import useModal from "@common/hooks/useModal"
const MenuItems: FC<MenuItemsProps> = ({ id }) => {
  const { toggle, handleToggle } = useToggle()
  const { openModal } = useModal()
  const { refetch } = useCategories()
  const { handleOpenAlert } = useAlertContext()
  const c = twMerge(optionstyles.options, styles.menuoptions)
  const { mutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess() {
      refetch()
    },
    onError(err) {
      handleOpenAlert({
        body: "An error occured",
        title: "Action uncompleted",
        type: "error",
      })
    },
  })

  const edit = () => {
    openModal({
      param: "categoryId",
      value: id,
    })
  }

  const mutateDelete = () => {
    mutate(id)
  }

  return (
    <div className={"relative"}>
      <IconButton onClick={handleToggle} icon={<Ellipsis color={"black"} />} />
      {toggle && (
        <div className={c}>
          <button onClick={edit}>Edit</button>
          <button onClick={mutateDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default MenuItems
