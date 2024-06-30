import { FC } from "react"
import useModal from "@common/hooks/useModal"
import Modal from "@common/components/Modal"
import ModalHeader from "@lib/admin-dashboard/components/ModalHeader"
import { useSearchParams } from "next/navigation"
import CategoryForm from "./CategoryForm"
import useCategories from "@lib/admin-categories/hooks/useCategories"
import { useRouter } from "next/router"

const CategoryModal: FC = () => {
  const { showModal, closeModal } = useModal()
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("categoryId")
  const { data: categories } = useCategories()

  const category = categories?.data.find(
    (c) => c.id === parseInt(categoryId ?? "")
  )

  const close = () => {
    router.push({
      query: {
        categoryId: "",
        showModal: "",
      },
    })
  }

  return (
    <Modal onExit={close} show={showModal}>
      <ModalHeader
        title={categoryId ? "Edit Category Details" : "Add new category"}
        subtitle={
          categoryId ? undefined : "Enter details to add a new category"
        }
      />
      <CategoryForm key={category?.id} category={category} />
    </Modal>
  )
}

export default CategoryModal
