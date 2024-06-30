import { FC, useEffect } from "react";
import { AttendeeMainForm } from "@lib/event-checkout/typings";
import styles from "../styles.module.css";
import FormField from "@common/components/FormControls/FormField";
import { useFormContext } from "react-hook-form";
import {
  ContactInformationFormType,
  ContactInformationSchema,
} from "@lib/event-checkout/utils/contactInformationSchema";
import FormCheck from "@common/components/FormControls/FormCheck";
import useToggle from "@common/hooks/useToggle";
import { compareObjects } from "@common/utils/compareObjects";
import useAlertContext from "@common/hooks/useAlertContext";

const Form: FC<AttendeeMainForm> = ({ ticketId, index }) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    resetField,
    watch,
  } = useFormContext<ContactInformationFormType>();
  const { handleOpenAlert } = useAlertContext();
  const { toggle: defaultBool, handleToggle } = useToggle();
  const formValues = watch();
  const compareWithContact = compareObjects(formValues.attendees?.[index], {
    firstName: formValues.customer.firstName,
    lastName: formValues.customer.lastName,
    email: formValues.customer.email,
    confirmEmail: formValues.customer.confirmEmail,
    ticketId: ticketId,
  });
  const isDefault = defaultBool || compareWithContact.isSame;
  const onDefaultChange = async () => {
    const value = !isDefault;

    if (!value) {
      resetField(`attendees.${index}`, {
        defaultValue: {
          firstName: "",
          lastName: "",
          email: "",
          confirmEmail: "",
          ticketId: ticketId,
        },
      });
      handleToggle();

      return;
    }

    const formValues = getValues();

    const isFormSafe = ContactInformationSchema.safeParse({
      ...formValues,
      attendees: [],
    }).success;

    if (!isFormSafe) {
      handleOpenAlert({
        title: "Invalid form",
        body: "Please fill the contact form first",
        type: "error",
      });
      return;
    }
    handleToggle();

    setValue(`attendees.${index}.firstName`, formValues.customer.firstName);
    setValue(`attendees.${index}.lastName`, formValues.customer.lastName);
    setValue(`attendees.${index}.email`, formValues.customer.email);
    setValue(
      `attendees.${index}.confirmEmail`,
      formValues.customer.confirmEmail,
    );
    await trigger("attendees");
  };

  useEffect(() => {
    setValue(`attendees.${index}.ticketId`, ticketId);
  }, [ticketId, index, setValue]);

  return (
    <div className={"space-y-4 mt-3"}>
      <FormCheck onChange={onDefaultChange} checked={isDefault}>
        Same as customer
      </FormCheck>
      <div className={styles.formgrid}>
        <FormField
          {...register(`attendees.${index}.firstName`)}
          error={errors.attendees?.[index]?.firstName?.message}
          label={"Attendee's first Name"}
          disabled={isDefault}
          placeholder={"First name"}
        />
        <FormField
          {...register(`attendees.${index}.lastName`)}
          error={errors.attendees?.[index]?.lastName?.message}
          label={"Attendee's last Name"}
          disabled={isDefault}
          placeholder={"Last name"}
        />
        <FormField
          label={"Attendee's email address"}
          disabled={isDefault}
          {...register(`attendees.${index}.email`)}
          error={errors.attendees?.[index]?.email?.message}
          placeholder={"attendee@thetbmevents.com"}
        />
        <FormField
          label={"Confirm attendee's email address"}
          disabled={isDefault}
          {...register(`attendees.${index}.confirmEmail`)}
          error={errors.attendees?.[index]?.confirmEmail?.message}
          placeholder={"attendee@thetbmevents.com"}
        />
      </div>
    </div>
  );
};

export default Form;
