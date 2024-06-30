import { FC } from "react";
import FormContainer from "../FormContainer";
import EventDetails from "./EventDetails";
import EventMetaData from "./EventMetaData";
import {
  AboutSchema,
  EventFormType,
} from "@lib/create-event/utils/eventSchema";
import { useFormContext } from "react-hook-form";
import Controls from "../Controls";
import styles from "../EventForms/styles.module.css";

const AboutForm: FC = () => {
  const { trigger, watch, setError, clearErrors } =
    useFormContext<EventFormType>();
  const aboutForm = watch("about");
  const eventType = watch("about.eventType");

  const isVirtualEvent = eventType === "virtual";

  const inValidEveentType =
    (aboutForm?.eventLink?.trim() === "" || !aboutForm?.eventLink) &&
    isVirtualEvent;

  const formValid =
    AboutSchema.safeParse(aboutForm).success && !inValidEveentType;
  const onSubmit = async () => {
    // Perform validation for event link
    const invalidLocation =
      aboutForm?.location?.trim() === "" && !isVirtualEvent;
    if (inValidEveentType) {
      setError("about.eventLink", {
        message: "Event link is required for virtual events",
      });
      return;
    }
    if (invalidLocation) {
      setError("about.location", {
        message: "Event location is required for physical events",
      });
      return;
    }
    clearErrors("about.location");
    clearErrors("about.eventLink");

    const formIsValid = await trigger("about");

    if (!formIsValid) return;
  };

  return (
    <form>
      <FormContainer className={styles.form}>
        <EventDetails />
        <EventMetaData />
      </FormContainer>
      <Controls onNext={onSubmit} moveToMext={formValid} />
    </form>
  );
};

export default AboutForm;
