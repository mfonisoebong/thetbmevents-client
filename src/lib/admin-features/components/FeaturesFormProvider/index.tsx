import { FC, PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FeaturesFormType,
  FeaturesSchema,
} from "@lib/admin-features/utils/featuresSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeaturesFormProviderProps } from "@lib/admin-features/typings";

const FeaturesFormProvider: FC<FeaturesFormProviderProps> = ({
  children,
  featuresData,
}) => {
  const defaultValues = {
    features: featuresData?.features.length
      ? featuresData?.features
      : [{}, {}, {}, {}, {}, {}],
    heading: featuresData?.heading?.heading,
    subHeading: featuresData?.heading?.sub_heading,
  };
  const form = useForm<FeaturesFormType>({
    resolver: zodResolver(FeaturesSchema),
    defaultValues,
  });
  return (
    <div className={"space-y-5 mx-auto w-11/12"}>
      <FormProvider {...form}>{children}</FormProvider>
    </div>
  );
};

export default FeaturesFormProvider;
