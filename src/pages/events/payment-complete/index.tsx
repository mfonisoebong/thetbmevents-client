import RouteLoader from "@common/components/RouteLoader";
import Head from "next/head";
import Container from "@common/components/Container";
import MainContent from "@lib/events-cart-payment-complete/components/MainContent";
import WhatsappButton from "@common/components/WhatsappButton";

export default function PaymentComplete() {
  return (
    <RouteLoader>
      <Head>
        <title>TBM - Events Cart</title>
      </Head>
      <WhatsappButton />

      <Container>
        <MainContent />
      </Container>
    </RouteLoader>
  );
}
