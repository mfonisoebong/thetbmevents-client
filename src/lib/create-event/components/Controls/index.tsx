import Button from "@common/components/Button";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import { createEvent } from "@lib/create-event/helpers/createEvent";
import { ControlsProps } from "@lib/create-event/typings";
import {
  EventFormType,
  EventSchema,
} from "@lib/create-event/utils/eventSchema";
import { filterValidTickets } from "@lib/create-event/utils/filterValidTickets";
import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
import useDashboardTabsContext from "@lib/dashboard/hooks/useDashboardTabsContext";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { updateEvent } from "@lib/edit-event/helpers/updateEvent";
import useUserEvent from "@lib/edit-event/hooks/useUserEvent";
import { compareObjects } from "@common/utils/compareObjects";

const Controls: FC<ControlsProps> = ({ onNext, moveToMext = true }) => {
  const { changeTabPosition, tabState } = useDashboardTabsContext();
  const isInFirstTab = tabState.activeTab === tabState.tabs[0];
  const currentTabIndex = tabState.tabs.findIndex(
    (v) => v === tabState.activeTab,
  );
  const router = useRouter();
  const { handleOpenAlert } = useAlertContext();
  const { watch } = useFormContext<EventFormType>();
  const eventdata = watch();
  const userEvents = useUserEvents();
  const event = useUserEvent();
  const isEdit = router.query?.id ? true : false;

  const { mutate, isLoading } = useMutation({
    mutationFn: isEdit ? updateEvent : createEvent,
    onSuccess() {
      handleOpenAlert({
        body: "Event created successfully",
        title: "Success",
        type: "success",
      });
      userEvents.refetch();
      event.refetch();
      router.push("/organizer/dashboard/events");
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  const eventFormValid = EventSchema.safeParse({
    ...eventdata,
    ticket: filterValidTickets(eventdata?.ticket),
  }).success;

  const lastTab = tabState.tabs[tabState.tabs.length - 1];
  const isLastPage = lastTab === tabState.activeTab;

  const toPreviousPage = () => {
    changeTabPosition(currentTabIndex - 1);
  };

  const toNextPage = () => {
    onNext && onNext();

    if (!moveToMext) return;

    changeTabPosition(currentTabIndex + 1);
  };

  const onSubmit = () => {
    const eventId = router.query?.id as string;
    const mutatedData = router.query?.id
      ? { ...eventdata, id: eventId }
      : eventdata;

    mutate(mutatedData);
  };

  return (
    <div className="flex justify-end space-x-5 items-center my-7">
      {!isInFirstTab && (
        <Button
          type="button"
          className="px-12"
          onClick={toPreviousPage}
          size="lg"
          variant="outline"
        >
          Previous
        </Button>
      )}
      {isLastPage ? (
        <>
          {eventFormValid && (
            <Button
              loading={isLoading}
              onClick={onSubmit}
              size="lg"
              className="bg-mainBlue px-12"
              type="button"
            >
              Submit
            </Button>
          )}
        </>
      ) : (
        <Button
          onClick={toNextPage}
          size="lg"
          className="bg-mainBlue px-12"
          type="button"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default Controls;
