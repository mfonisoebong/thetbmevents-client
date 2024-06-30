import FormSelectField from "@common/components/FormControls/FormSelectField";
import {
  AboutFormType,
  EventFormType,
} from "@lib/create-event/utils/eventSchema";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import styles from "../EventForms/styles.module.css";
import ArrowDown from "@common/components/Icons/ArrowDown";
import { useRouter } from "next/router";
import FormField from "@common/components/FormControls/FormField";
import FormTextAreaField from "@common/components/FormControls/FormTextAreaField";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import At from "@common/components/Icons/At";
import EventImage from "@lib/create-event/components/AboutForm/EventImage";

const EventDetails: FC = () => {
  const {
    register,
    formState: { errors },
    resetField,
  } = useFormContext<EventFormType>();
  const { query } = useRouter();
  const defaultType = query?.type as string;

  return (
    <>
      <FormField
        required
        error={errors.about?.name?.message}
        placeholder="Rave & Roses ultra"
        label="Event name"
        {...register("about.name")}
      />
      <FormSelectField
        icon={<ArrowDown size={14} />}
        error={errors.about?.eventType?.message}
        noShadow
        required
        label="Event type"
        {...register("about.eventType", {
          onChange() {
            resetField("about.eventLink");
            resetField("about.location");
            resetField("about.locationTips");
          },
        })}
        defaultValue={defaultType}
      >
        <option value="physical">Physical</option>
        <option value="virtual">Virtual</option>
      </FormSelectField>

      <FormTextAreaField
        required
        error={errors.about?.description?.message}
        placeholder="Physical touch and pornography activities at rema show be there live and direct and witness greatness"
        label="Description"
        {...register("about.description")}
      />
      <EventImage />
    </>
  );
};

export default EventDetails;
