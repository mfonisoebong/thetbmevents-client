import FilteredEvents from "@lib/events/components/FilteredEvents";
import FreeEvents from "@lib/events/components/FreeEvents";
import Hero from "@lib/events/components/Hero";
import OnlineEvents from "@lib/events/components/OnlineEvents";
import PaidEvents from "@lib/events/components/PaidEvents";
import TopEvents from "@lib/events/components/TopEvents";
import TopEventsInCity from "@lib/events/components/TopEventsInCity";
import TopEventsInCountry from "@lib/events/components/TopEventsInCountry";
import EventsProvider from "@lib/events/contexts/Events/Provider";
import { getEvents } from "@lib/events/helpers/getEvents";
import { EventPageProps, FilterQueryOptions } from "@lib/events/typings";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import WhatsappButton from "@common/components/WhatsappButton";
import LatestEvents from "@lib/events/components/LatestEvents";
import SSOHead from "@common/components/SSOHead";

export default function Events(props: EventPageProps) {
  const router = useRouter();
  const query = router.query as FilterQueryOptions;
  const filterOptions =
    query.search || query.category || query.location || query.date;

  return (
    <>
      <SSOHead
        title={"TBM Events - Events"}
        description={
          "Discover events from the variety of organizers that use TBM events as\n" +
          "        their trusted event-ticketing platform"
        }
        og={{}}
      />
      <Hero />
      <WhatsappButton />

      {!filterOptions ? (
        <>
          <EventsProvider eventData={props}>
            <TopEvents />
            <LatestEvents />
            <TopEventsInCountry />
            <TopEventsInCity />
            <FreeEvents />
            <PaidEvents />
            <OnlineEvents />
          </EventsProvider>
        </>
      ) : (
        <FilteredEvents />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps<EventPageProps> = async () => {
  try {
    const events = await getEvents();

    return {
      props: events,
      revalidate: 10,
    };
  } catch (err) {
    return {
      props: {
        popular: {
          free: [],
          online: [],
          paid: [],
        },
        top_events: [],
        latest_events: [],
      },
      revalidate: 10,
    };
  }
};
