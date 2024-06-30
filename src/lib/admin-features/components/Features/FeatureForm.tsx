import { FC } from "react";
import { FeatureFormProps } from "@lib/admin-features/typings";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import { useFormContext } from "react-hook-form";
import FormField from "@common/components/FormControls/FormField";
import { FeaturesFormType } from "@lib/admin-features/utils/featuresSchema";
import Thumbnail from "@lib/admin-features/components/Features/Thumbnail";
import styles from "./styles.module.css";

const FeatureForm: FC<FeatureFormProps> = ({ index }) => {
  const {
    register,
    watch,

    formState: { errors },
  } = useFormContext<FeaturesFormType>();

  return (
    <OverviewCard title={`Feature ${index + 1}`} theme={"light"}>
      <div className={"mt-4 space-y-2"}>
        <FormField
          placeholder={"Enter your feature"}
          label={"Feature Title"}
          className={styles.formfield}
          {...register(`features.${index}.title`)}
        />
        <div className={"space-y-2"}>
          <label className={"font-semibold text-sm"}>Event thumbnail</label>
          <Thumbnail index={index} />
        </div>
      </div>
    </OverviewCard>
  );
};

export default FeatureForm;
