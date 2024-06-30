import useDashboardTabsContext from "@lib/dashboard/hooks/useDashboardTabsContext";
import { FC } from "react";
import AboutForm from "../AboutForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  EventFormType,
  EventSchema,
} from "@lib/create-event/utils/eventSchema";
import DateForm from "../DateForm";
import TicketForm from "../TicketForm";
import { EventFormProps } from "@lib/create-event/typings";

const EventForms: FC<EventFormProps> = ({ event, tickets }) => {
  const {
    tabState: { activeTab },
  } = useDashboardTabsContext();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const eventForm = useForm<EventFormType>({
    resolver: zodResolver(EventSchema),
    defaultValues: event
      ? {
          about: {
            name: event.title,
            category: event.categories,
            eventLink: event.event_link,
            eventType: event.type,
            description: event.description,
            image: event.logo,
            location: event.location,
            undiscloseLocation: event.undisclose_location,
            locationTips: event.location_tips,
            social: {
              facebook: event.links_facebook,
              instagram: event.links_instagram,
              twitter: event.links_twitter,
            },
          },
          date: {
            eventDate: event.event_date,
            timeZone: event.timezone,
            eventTime: event.event_time,
          },
          ticket: tickets?.map((t) => ({
            name: t.name,
            price: t.price,
            unlimited: t.unlimited,
            quantity: t.quantity,
            description: t.description,
            id: t.id,
            sellingDate: {
              end: t.selling_end_date_time,
              start: t.selling_start_date_time,
            },
          })),
        }
      : {
          date: {
            timeZone: userTimezone,
          },
        },
  });

  return (
    <FormProvider {...eventForm}>
      {activeTab === "About" && <AboutForm />}
      {activeTab === "Date" && <DateForm />}
      {activeTab === "Ticket" && <TicketForm />}
    </FormProvider>
  );
};

export default EventForms;
