import { FC } from "react";
import { TestimoniesFormProviderProps } from "@lib/admin-testimonies/typings";
import { FormProvider, useForm } from "react-hook-form";
import {
  TestimoniesFormType,
  TestimoniesSchema,
} from "@lib/admin-testimonies/utils/testimoniesSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const TestimoniesFormProvider: FC<TestimoniesFormProviderProps> = ({
  testimoniesData,
  children,
}) => {
  const defaultTestimonies = Array(9)
    .fill(undefined)
    .map(() => ({}));
  const defaultValues = {
    heading: testimoniesData?.heading?.heading,
    subHeading: testimoniesData?.heading?.sub_heading,
    testimonies:
      testimoniesData.testimonies.length === 0
        ? defaultTestimonies
        : testimoniesData.testimonies,
  };
  const testimoniesForm = useForm<TestimoniesFormType>({
    resolver: zodResolver(TestimoniesSchema),
    defaultValues,
  });

  return (
    <div className={"space-y-5 mx-auto w-11/12"}>
      <FormProvider {...testimoniesForm}>{children}</FormProvider>
    </div>
  );
};

export default TestimoniesFormProvider;
