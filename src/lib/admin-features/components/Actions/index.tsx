import { FC } from "react";
import Button from "@common/components/Button";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import {
  FeaturesFormType,
  FeaturesSchema,
} from "@lib/admin-features/utils/featuresSchema";
import { useMutation } from "@tanstack/react-query";
import { updateFeatures } from "@lib/admin-features/helpers/updateFeatures";
import useAlertContext from "@common/hooks/useAlertContext";
import useFeatures from "@lib/admin-features/hooks/useFeatures";
import { compareObjects } from "@common/utils/compareObjects";

const Actions: FC = () => {
  const router = useRouter();
  const { watch } = useFormContext<FeaturesFormType>();
  const featuresForm = watch();
  const formValid = FeaturesSchema.safeParse(featuresForm).success;
  const { handleOpenAlert } = useAlertContext();
  const { data: featuresData, refetch } = useFeatures();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateFeatures,
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

  const defaultValues = {
    features: featuresData?.features.length
      ? featuresData?.features
      : [{}, {}, {}, {}, {}, {}],
    heading: featuresData?.heading?.heading,
    subHeading: featuresData?.heading?.sub_heading,
  };
  const isSame = compareObjects(defaultValues, featuresForm);
  const save = () => {
    mutate(featuresForm);
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
