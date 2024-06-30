import FormField from "@common/components/FormControls/FormField"
import { zodResolver } from "@hookform/resolvers/zod"
import { CategoryFormProps } from "@lib/admin-categories/typings"
import {
  CategoryFormType,
  CategorySchema,
} from "@lib/admin-categories/utils/categorySchema"
import { FC } from "react"
import { useForm } from "react-hook-form"
import styles from "./styles.module.css"
import Button from "@common/components/Button"
import { useMutation } from "@tanstack/react-query"
import { createCategory } from "@lib/admin-categories/helpers/createCategory"
import { useRouter } from "next/router"
import useAlertContext from "@common/hooks/useAlertContext"
import useCategories from "@lib/admin-categories/hooks/useCategories"
import { updateCategory } from "@lib/admin-categories/helpers/updateCategory"

const CategoryForm: FC<CategoryFormProps> = ({ category }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      category: category?.category,
      slug: category?.slug,
    },
  })
  const { refetch } = useCategories()
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: category ? update : createCategory,
    onSuccess() {
      handleOpenAlert({
        body: `Catalog ${category ? "updated" : "created"} successfully`,
        title: "Success",
        type: "success",
      })
      reset()
      refetch()
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      })
    },
  })

  const onSubmit = (data: CategoryFormType) => {
    mutate(data)
  }

  async function update() {
    if (!category) return
    const data = getValues()
    await updateCategory({ ...data, id: category.id })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField
        {...register("category")}
        error={errors.category?.message}
        label={"Category"}
      />
      <FormField
        {...register("slug")}
        error={errors.slug?.message}
        label={"Category slug"}
      />
      <Button loading={isLoading} type="submit">
        {category?.id ? "Edit" : "Submit"}
      </Button>
    </form>
  )
}

export default CategoryForm
