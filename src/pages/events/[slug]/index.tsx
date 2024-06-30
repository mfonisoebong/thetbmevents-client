import { FC } from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import useEvent from "@lib/event/hooks/useEvent";
import RedirectWrapper from "@lib/event/components/RedirectWrapper";
import Container from "@common/components/Container";
import WhatsappButton from "@common/components/WhatsappButton";
import EventImage from "@lib/event/components/EventImage";
import EventDetails from "@lib/event/components/EventDetails";
import Checkout from "@lib/event/components/Checkout";
import { getEvent } from "@lib/event/helpers/getEvent";
import { EventPageProps } from "@lib/event/typings";
import { getEventsSlugs } from "@lib/event/helpers/getEventsSlugs";
import EventProvider from "@lib/event/contexts/EventContext/Provider";
import SSOHead from "@common/components/SSOHead";

const EventPage: FC<EventPageProps> = ({ event, title, tickets }) => {
  return (
    <>
      <SSOHead
        description={event.description}
        og={{
          image: event.logo,
          description: event.description,
          title: event.title,
        }}
        title={event.title}
      />

      <WhatsappButton />

      <Container className={"py-6 space-y-3"}>
        <EventProvider tickets={tickets} event={event}>
          <EventImage />
          <EventDetails />
          <Checkout />
        </EventProvider>
      </Container>
    </>
  );
};

export default EventPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<EventPageProps> = async (
  context
) => {
  const event = await getEvent(context.params?.slug as string);

  return {
    props: {
      title: event.event.title,
      ...event,
    },
    revalidate: 10,
  };
};
