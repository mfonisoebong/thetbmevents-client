import FormField from "@common/components/FormControls/FormField";
import useTimezones from "@common/hooks/useTimezones";
import { FC } from "react";
import styles from "../EventForms/styles.module.css";
import { useFormContext } from "react-hook-form";
import { EventFormType } from "@lib/create-event/utils/eventSchema";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import ArrowDown from "@common/components/Icons/ArrowDown";
import Loader from "@common/components/Icons/Loader";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import moment from "moment";

const EventTimeZoneAndDate: FC = () => {
  const timezones = useTimezones();
  const {
    register,
    formState: { errors },
  } = useFormContext<EventFormType>();

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timeZoneIcon = timezones.isLoading ? (
    <Loader color="black" size={14} />
  ) : (
    <ArrowDown size={14} />
  );

  return (
    <>
      <FormSelectField
        required
        label="Event time zone"
        icon={timeZoneIcon}
        {...register("date.timeZone")}
        error={errors.date?.timeZone?.message}
      >
        <option value="">--Select an option--</option>
        <option value={userTimezone}>{userTimezone}</option>
        {timezones.data?.map((t) => (
          <option key={t.value + t.abbr}>{t.value}</option>
        ))}
      </FormSelectField>

      <FormField
        {...register("date.eventDate")}
        error={errors.date?.eventDate?.message}
        type="date"
        label="Event date"
        required
      />
      <FormField
        {...register("date.eventTime")}
        error={errors.date?.eventTime?.message}
        type="time"
        label="Event time"
      />
    </>
  );
};

export default EventTimeZoneAndDate;
