import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Button from "@common/components/Button";
import { useForm } from "react-hook-form";
import {
  BlastEmailSchema,
  EventType,
} from "@lib/blast-email/utils/emailSchema";
import { BlastEmailFormType } from "@lib/blast-email/utils/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@common/components/FormControls/FormField";
import ErrorText from "@common/components/ErrorText";
import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import IconButton from "@common/components/IconButton";
import Close from "@common/components/Icons/Close";
import { useMutation } from "@tanstack/react-query";
import { sendBlastEmail } from "@lib/blast-email/helpers/blastEmail";
import useAlertContext from "@common/hooks/useAlertContext";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
export const EmailForm: FC = () => {
  const {
    register,
    watch,
    getValues,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<BlastEmailFormType>({
    resolver: zodResolver(BlastEmailSchema),
  });
  const router = useRouter();
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: sendBlastEmail,
    onSuccess() {
      handleOpenAlert({
        body: "Email sent successfully",
        title: "Success",
        type: "success",
      });
      router.push("/organizer/dashboard/events");
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      });
    },
  });
  const userEvents = useUserEvents();
  const events = watch("events") ?? [];

  const eventIds = events?.map((event) => event.id);
  const availableEvents =
    userEvents.data?.filter((event) => !eventIds?.includes(event.id)) ?? [];

  const emailContent = watch("emailContent");
  const handleChange = (value: string) => {
    setValue("emailContent", value);
    if (value.length > 0) {
      clearErrors("emailContent");
    }
  };

  const handleSelectEvent = (eventId: string) => {
    const event = availableEvents.find((event) => event.id === eventId);
    if (!event) {
      return;
    }
    const prevValues = getValues("events") ?? [];

    const newEventIds = [
      ...prevValues,
      {
        id: event.id,
        title: event.title,
      },
    ];
    setValue("events", newEventIds);
  };

  const handleRemoveEvent = (eventId: string) => {
    return () => {
      const prevValues = getValues("events") ?? [];
      const newEventIds = prevValues.filter((event) => event.id !== eventId);
      setValue("events", newEventIds);
    };
  };
  const onSubmit = handleSubmit((data: BlastEmailFormType) => {
    mutate(data);
    // Handle form submission logic here
  });

  return (
    <OverviewCard className="h-max" theme="light">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Subject"
          {...register("subject")}
          error={errors.subject?.message}
        />
        <div className="space-y-2">
          <ReactQuill
            style={{
              height: "10rem",
              backgroundColor: "white",
              marginBottom: "4rem",
            }}
            id="description"
            theme="snow"
            value={emailContent}
            onChange={handleChange}
          />
          {errors.emailContent?.message && (
            <ErrorText>{errors.emailContent.message}</ErrorText>
          )}
        </div>
        <FormSelectField
          onChange={(e) => handleSelectEvent(e.target.value)}
          label={"Events"}
        >
          <option value="">--Select an option--</option>
          {availableEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          )) ?? null}
        </FormSelectField>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {events.map((event) => (
            <IconButton
              key={event.id}
              onClick={handleRemoveEvent(event.id)}
              type="button"
              variant="fill"
              className="text-xs md:text-sm"
              icon={<Close color="red" />}
            >
              {event.title}
            </IconButton>
          ))}
        </div>
        {errors.events?.message && (
          <ErrorText>{errors.events.message}</ErrorText>
        )}

        <Button loading={isLoading}>Send</Button>
      </form>
    </OverviewCard>
  );
};
