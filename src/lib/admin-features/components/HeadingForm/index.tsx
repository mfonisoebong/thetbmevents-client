import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import FormField from "@common/components/FormControls/FormField";
import { useFormContext } from "react-hook-form";
import { FeaturesFormType } from "@lib/admin-features/utils/featuresSchema";
import styles from "./styles.module.css";
const HeadingForm: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FeaturesFormType>();

  return (
    <OverviewCard theme={"light"}>
      <div className={styles.headingform}>
        <FormField
          placeholder={"Type in the heading"}
          className={"lg:w-1/2"}
          label={"Heading"}
          {...register("heading")}
          error={errors.heading?.message}
        />
        <FormField
          placeholder={"Type in the sub-heading"}
          className={"lg:w-1/2"}
          label={"Sub heading"}
          {...register("subHeading")}
          error={errors.subHeading?.message}
        />
      </div>
    </OverviewCard>
  );
};

export default HeadingForm;
