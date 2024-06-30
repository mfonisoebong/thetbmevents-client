import { FormSetProps } from "@lib/create-event/typings";
import { ChangeEvent, FC } from "react";
import FormContainer from "../../FormContainer";
import styles from "@lib/create-event/components/EventForms/styles.module.css";
import FormField from "@common/components/FormControls/FormField";
import { useFormContext, useForm } from "react-hook-form";
import {
  EventFormType,
  TicketFormType,
  TicketSchema,
} from "@lib/create-event/utils/eventSchema";
import Button from "@common/components/Button";
import FormCheck from "@common/components/FormControls/FormCheck";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextAreaField from "@common/components/FormControls/FormTextAreaField";
import moment from "moment/moment";

const FormSet: FC<FormSetProps> = ({ closeForm }) => {
  const { watch: watchEvent } = useFormContext<EventFormType>();
  const {
    register,
    handleSubmit,
    setValue: setTicketValue,
    setError,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<TicketFormType>({
    resolver: zodResolver(TicketSchema),
  });
  const unlimitedSelected = watch("unlimited");
  const { setValue, getValues } = useFormContext<EventFormType>();
  const minDateTime = watch("sellingDate.start");

  const maxDateTime = moment(watchEvent("date.eventDate")).format(
    "YYYY-MM-DDTHH:mm",
  );

  const addAnotherForm = async (ticket: TicketFormType) => {
    const initial = getValues("ticket");
    const newTickets = [...initial, ticket];

    if (!ticket.unlimited && ticket.quantity < 1) {
      setError("quantity", { message: "Quantity is required" });
      return;
    }
    clearErrors("quantity");
    setValue("ticket", newTickets);
    closeForm();
  };

  const onUnlimitedCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTicketValue("quantity", 0);
    }
  };

  return (
    <div className={styles.form}>
      <FormContainer>
        <FormField
          label="Ticket name"
          type="text"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          type="number"
          label="Ticket price"
          step={1}
          error={errors.price?.message}
          required
          {...register("price", { valueAsNumber: true })}
        />

        <FormField
          type={"datetime-local"}
          label="Start selling date"
          {...register("sellingDate.start")}
          max={maxDateTime}
          required
          error={errors.sellingDate?.start?.message}
        />
        <FormField
          type={"datetime-local"}
          key={minDateTime}
          label="End selling date"
          min={minDateTime}
          max={maxDateTime}
          {...register("sellingDate.end")}
          required
          error={errors.sellingDate?.end?.message}
        />
        <FormField
          type="number"
          label="Ticket quantity"
          step={1}
          disabled={unlimitedSelected}
          error={errors.quantity?.message}
          required
          {...register("quantity", { valueAsNumber: true })}
        >
          <FormCheck
            {...register("unlimited", {
              onChange: onUnlimitedCheck,
            })}
          >
            Unlimited
          </FormCheck>
        </FormField>
        <FormTextAreaField
          {...register("description")}
          required
          label="Description"
          error={errors.description?.message}
        />
      </FormContainer>
      <div className="flex space-x-3 items-center">
        <Button onClick={handleSubmit(addAnotherForm)} type="button">
          Add
        </Button>
      </div>
    </div>
  );
};

export default FormSet;
