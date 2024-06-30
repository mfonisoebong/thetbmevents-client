import styles from "../EventForms/styles.module.css";
import { FC } from "react";
import { EventFormType } from "@lib/create-event/utils/eventSchema";
import { useFormContext } from "react-hook-form";
import EventImage from "./EventImage";
import FormField from "@common/components/FormControls/FormField";
import useCategories from "@lib/events/hooks/useCategories";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import Loader from "@common/components/Icons/Loader";
import ArrowDown from "@common/components/Icons/ArrowDown";
import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter";
import FormCheck from "@common/components/FormControls/FormCheck";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import At from "@common/components/Icons/At";

const EventMetaData: FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<EventFormType>();
  const categories = useCategories();
  const eventType = watch("about.eventType");
  const isVirtualEvent = eventType === "virtual";

  const categoryInputIcon = categories.isLoading ? (
    <Loader color="black" size={15} />
  ) : (
    <ArrowDown size={15} />
  );

  return (
    <>
      {isVirtualEvent && (
        <FormField
          required={isVirtualEvent}
          error={errors.about?.eventLink?.message}
          label="Event Link"
          {...register("about.eventLink")}
        />
      )}
      <FormSelectField
        required
        error={errors.about?.category?.message}
        label="Category"
        icon={categoryInputIcon}
        {...register("about.category")}
      >
        <option value="">--Select an option--</option>
        {categories.data?.map((c, i) => (
          <option value={c.category} key={c.id}>
            {capitalizeFirstLetter(c.category)}
          </option>
        ))}
      </FormSelectField>
      {!isVirtualEvent && (
        <FormField
          error={errors.about?.location?.message}
          label="Event Location"
          required
          {...register("about.location")}
        >
          <FormCheck
            error={errors.about?.undiscloseLocation?.message}
            className="text-xs"
            {...register("about.undiscloseLocation")}
          >
            Disclose {isVirtualEvent ? "event link" : "location"} to only those
            who have purchase the ticket.
          </FormCheck>
        </FormField>
      )}

      {!isVirtualEvent && (
        <FormField
          error={errors.about?.locationTips?.message}
          {...register("about.locationTips")}
          label="Location Tips "
        />
      )}

      <FormFieldset className="flex-col space-y-2 space-x-0">
        <FormField
          error={errors.about?.social?.instagram?.message}
          label="Instagram"
          iconPosition="left"
          icon={<At color="gray" />}
          {...register("about.social.instagram")}
        />
        <FormField
          error={errors.about?.social?.facebook?.message}
          label="Facebook"
          iconPosition="left"
          icon={<At color="gray" />}
          {...register("about.social.facebook")}
        />
        <FormField
          error={errors.about?.social?.twitter?.message}
          label="Twitter"
          iconPosition="left"
          icon={<At color="gray" />}
          {...register("about.social.twitter")}
        />
      </FormFieldset>
    </>
  );
};

export default EventMetaData;
