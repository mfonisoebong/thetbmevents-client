import useEvent from "@lib/event/hooks/useEvent";
import Head from "next/head";
import TicketsProvider from "@lib/event-checkout/contexts/Tickets/Provider";
import Container from "@common/components/Container";
import Summary from "@lib/event-checkout/components/Summary";
import MainContent from "@lib/event-checkout/components/MainContent";

const EventCheckout = () => {
  const { data: event } = useEvent();
  const pageTitle = event?.event.title
    ? `${event?.event.title} - Checkout`
    : "Loading...";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Container>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-20">
          <TicketsProvider>
            <MainContent />
            <Summary />
          </TicketsProvider>
        </div>
      </Container>
    </>
  );
};

export default EventCheckout;
