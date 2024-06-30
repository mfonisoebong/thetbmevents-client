import { FC } from "react";
import { FeatureFormProps } from "@lib/admin-features/typings";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import TestimonyAvatar from "@lib/admin-testimonies/components/Testimonies/TestimonyAvatar";
import { useFormContext } from "react-hook-form";
import { TestimoniesFormType } from "@lib/admin-testimonies/utils/testimoniesSchema";
import FormField from "@common/components/FormControls/FormField";
import FormTextAreaField from "@common/components/FormControls/FormTextAreaField";
import { Channel } from "@lib/admin-testimonies/typings";
import ChannelItem from "@lib/admin-testimonies/components/Testimonies/ChannelItem";
import styles from "./styles.module.css";
const TestimonyForm: FC<FeatureFormProps> = ({ index }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TestimoniesFormType>();
  const channels: Channel[] = ["twitter", "instagram", "facebook"];

  return (
    <OverviewCard theme={"light"}>
      <div className={styles.testimony}>
        <TestimonyAvatar index={index} />
        <FormField
          className={styles.formfield}
          label={"Name"}
          {...register(`testimonies.${index}.name`)}
        />
        <FormTextAreaField
          className={styles.formfield}
          label={"Description"}
          {...register(`testimonies.${index}.description`)}
        />
        <div className="flex space-x-2">
          {channels.map((c) => (
            <ChannelItem index={index} channel={c} key={c} />
          ))}
        </div>
      </div>
    </OverviewCard>
  );
};
export default TestimonyForm;
