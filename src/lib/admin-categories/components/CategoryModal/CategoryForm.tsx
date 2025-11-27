import Button from "@common/components/Button";
import ErrorText from "@common/components/ErrorText";
import FormField from "@common/components/FormControls/FormField";
import Close from "@common/components/Icons/Close";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import { fileToDataUrl } from "@common/utils/fileToDataUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategory } from "@lib/admin-categories/helpers/createCategory";
import { removeIconImage } from "@lib/admin-categories/helpers/removeIcon";
import { updateCategory } from "@lib/admin-categories/helpers/updateCategory";
import useCategories from "@lib/admin-categories/hooks/useCategories";
import { CategoryFormProps } from "@lib/admin-categories/typings";
import {
  CategoryFormType,
  CategorySchema,
} from "@lib/admin-categories/utils/categorySchema";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";

const CategoryForm: FC<CategoryFormProps> = ({ category }) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      category: category?.category,
      slug: category?.slug,
    },
  });
  const [icon, setIcon] = useState<string | undefined | null>(category?.icon);
  const { refetch } = useCategories();
  const { getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
    },
    // 2mb
    maxSize: 2 * 1024 * 1024,
    async onDropAccepted(files) {
      setValue("icon", files[0]);
      clearErrors("icon");
      setIcon(await fileToDataUrl(files[0]));
    },
    onDropRejected(reject) {
      const message = reject[0].errors[0].message;
      setError("icon", {
        message,
      });
    },
  });
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: category ? update : createCategory,
    onSuccess() {
      handleOpenAlert({
        body: `Catalog ${category ? "updated" : "created"} successfully`,
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      });
    },
  });

  const removeIconMutate = useMutation({
    mutationFn: removeIconImage,
    onSuccess() {
      setIcon(undefined);
      handleOpenAlert({
        body: "Catalog icon removed successfully",
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  const onSubmit = (data: CategoryFormType) => {
    mutate(data);
  };

  async function update() {
    if (!category) return;
    const data = getValues();
    await updateCategory({ ...data, id: category.id });
  }

  const removeIcon = async () => {
    setIcon(undefined);
    setValue("icon", undefined);
  };

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
      <input type="text" {...getInputProps()} />
      <div>
        <div className="flex items-center space-x-2">
          <Button type="button" onClick={open} variant="outline" size="sm">
            Upload icon
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (!category) return;
              removeIconMutate.mutate(category.id);
            }}
            disabled={!category}
            loading={removeIconMutate.isLoading}
            variant="secondaryAlt"
            size="sm"
          >
            Delete icon
          </Button>
        </div>
        {typeof errors.icon?.message === "string" && (
          <ErrorText>{errors.icon.message}</ErrorText>
        )}
        {icon && (
          <button onClick={removeIcon} className="relative w-max">
            <Image
              src={icon}
              alt=""
              width={60}
              height={60}
              className="rounded-md w-12 h-12 object-cover"
            />
            <span className="absolute top-0 right-0 bg-white rounded-full  p-0.5">
              <Close color="red" />
            </span>
          </button>
        )}
      </div>
      <Button className="w-full" loading={isLoading} type="submit">
        {category?.id ? "Edit" : "Submit"}
      </Button>
    </form>
  );
};

export default CategoryForm;
