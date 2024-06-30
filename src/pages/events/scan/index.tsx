import Head from "next/head";
import Header from "@lib/ticket-scanner/components/Header";
import QrCodeScanner from "@lib/ticket-scanner/components/QrCodeScanner";
import { QrcodeSuccessCallback } from "html5-qrcode";
import isValidTicket from "@lib/ticket-scanner/utils/isValidTicket";
import ScanResult from "@lib/ticket-scanner/components/ScanResult";
import { useState } from "react";
import { TicketMetaData } from "@lib/ticket-scanner/typings";
import { GetStaticProps } from "next";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import RenderHydrated from "@common/components/RenderHydrated";
import CheckDevice from "@lib/ticket-scanner/components/CheckDevice";

export default function Scan() {
  const [ticket, setTicket] = useState<TicketMetaData | null>(null);

  const onNewScanResult: QrcodeSuccessCallback = (
    decodedText,
    decodedResult,
  ) => {
    const decoded = JSON.parse(decodedText);

    if (!isValidTicket(decoded)) return;

    setTicket(decoded);
  };

  const closeModal = () => {
    setTicket(null);
  };

  return (
    <>
      <Head>
        <title>Scan events</title>
      </Head>
      <RedirectUser page="organizer" />
      <main
        className={"relative overflow-hidden w-full h-[100vh] bg-main py-5"}
      >
        <RenderHydrated>
          <Header />

          <CheckDevice>
            <QrCodeScanner
              fps={10}
              qrbox={250}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
            <ScanResult ticket={ticket} close={closeModal} />
          </CheckDevice>
        </RenderHydrated>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = (context) => {
  return {
    props: {},
  };
};
