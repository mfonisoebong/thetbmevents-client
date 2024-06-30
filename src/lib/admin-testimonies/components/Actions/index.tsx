import { FC } from "react";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import {
  TestimoniesFormType,
  TestimoniesSchema,
} from "@lib/admin-testimonies/utils/testimoniesSchema";
import { compareObjects } from "@common/utils/compareObjects";
import useTestimonies from "@lib/admin-testimonies/hooks/useTestimonies";
import { useMutation } from "@tanstack/react-query";
import useAlertContext from "@common/hooks/useAlertContext";
import { updateTestimonies } from "@lib/admin-testimonies/helpers/updateTestimonies";
import Button from "@common/components/Button";

const Actions: FC = () => {
  const router = useRouter();

  const { watch } = useFormContext<TestimoniesFormType>();

  const form = watch();
  const formValid = TestimoniesSchema.safeParse(form).success;
  const { data: testimoniesData, refetch } = useTestimonies();
  const defaultTestimonies = Array(9)
    .fill(undefined)
    .map(() => ({}));
  const defaultValues = {
    heading: testimoniesData?.heading?.heading,
    subHeading: testimoniesData?.heading?.sub_heading,
    testimonies:
      testimoniesData?.testimonies.length === 0
        ? defaultTestimonies
        : testimoniesData?.testimonies,
  };
  const isSame = compareObjects(defaultValues, form);
  const { handleOpenAlert } = useAlertContext();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateTestimonies,
    onSuccess() {
      handleOpenAlert({
        body: "Features has been updated",
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occurred",
        title: "Failed",
        type: "error",
      });
    },
  });

  const save = () => {
    mutate(form);
  };

  return (
    <div className="flex items-center justify-center space-x-7">
      <Button disabled={isLoading} variant={"outline"} onClick={router.back}>
        Back
      </Button>
      <Button
        onClick={save}
        loading={isLoading}
        disabled={!formValid || isSame.isSame}
      >
        Save
      </Button>
    </div>
  );
};

export default Actions;
