import FormSelectField from "@common/components/FormControls/FormSelectField";
import { EventFormType } from "@lib/create-event/utils/eventSchema";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import ArrowDown from "@common/components/Icons/ArrowDown";
import { useRouter } from "next/router";
import FormField from "@common/components/FormControls/FormField";
import EventImage from "@lib/create-event/components/AboutForm/EventImage";
import "react-quill/dist/quill.snow.css";
import ErrorText from "@common/components/ErrorText";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const EventDetails: FC = () => {
  const {
    register,
    formState: { errors },
    resetField,
    setValue,
    clearErrors,
    watch,
  } = useFormContext<EventFormType>();
  const { query } = useRouter();
  const defaultType = query?.type as string;

  const handleChange = (value: string) => {
    setValue("about.description", value);
    if (value.length > 0) {
      clearErrors("about.description");
    }
  };

  const description = watch("about.description");

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
      <div className="space-y-2">
        <label id="description" htmlFor="">
          Description
        </label>
        <ReactQuill
          id="description"
          className="bg-white min-h-[15rem] max-h-full "
          theme="snow"
          value={description}
          onChange={handleChange}
        />
        {errors.about?.description?.message && (
          <ErrorText>{errors.about?.description?.message}</ErrorText>
        )}
      </div>

      <EventImage />
    </>
  );
};

export default EventDetails;
