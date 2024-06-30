import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  ExportAttendeesSchema,
  ExportAttendeesSchemaType,
} from "@lib/dashboard-events/utils/exportAttendeesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
import ArrowDown from "@common/components/Icons/ArrowDown";
import Button from "@common/components/Button";
import useAlertContext from "@common/hooks/useAlertContext";
import { useMutation } from "@tanstack/react-query";
import { exportAttendees } from "@lib/dashboard-events/helpers/exportAttendees";
import { downloadCSVFile } from "@common/utils/downloadCSVFile";
import { errorParser } from "@common/utils/errorParser";

const ExportForm: FC = () => {
  const { data: events } = useUserEvents();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ExportAttendeesSchemaType>({
    resolver: zodResolver(ExportAttendeesSchema),
  });

  const { handleOpenAlert } = useAlertContext();

  const { mutate, isLoading } = useMutation({
    mutationFn: exportAttendees,
    onSuccess(data) {
      const filename = `${Date.now()}_attendees.csv`;
      downloadCSVFile(data, filename);
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  const onFormSubmit = (data: ExportAttendeesSchemaType) => {
    mutate(data.eventId);
  };

  const eventsList = events?.map((e) => ({
    label: e.title,
    value: e.id,
  }));

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={"flex space-x-3 w-full items-center"}
    >
      <FormSelectField
        {...register("eventId")}
        error={errors.eventId?.message}
        icon={<ArrowDown size={15} />}
        className={"w-full"}
      >
        {eventsList?.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </FormSelectField>
      <Button loading={isLoading} size={"sm"} className={"h-max "}>
        Export
      </Button>
    </form>
  );
};

export default ExportForm;
