import { FC } from "react";
import FormContainer from "../FormContainer";
import EventTimeZoneAndDate from "./EventTimeZoneAndDate";
import Controls from "../Controls";
import { useFormContext } from "react-hook-form";
import { DateSchema, EventFormType } from "@lib/create-event/utils/eventSchema";
import styles from "@lib/create-event/components/EventForms/styles.module.css";

const DateForm: FC = () => {
  const { trigger, watch } = useFormContext<EventFormType>();

  const dateForm = watch("date");
  const formIsValid = DateSchema.safeParse(dateForm).success;

  const onSubmit = async () => {
    trigger("date");
  };

  return (
    <form>
      <FormContainer className={styles.form}>
        <EventTimeZoneAndDate />
      </FormContainer>
      <Controls onNext={onSubmit} moveToMext={formIsValid} />
    </form>
  );
};

export default DateForm;
