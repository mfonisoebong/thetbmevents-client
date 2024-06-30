import Head from "next/head";
import PageHero from "@common/components/PageHero";
import RouteLoader from "@common/components/RouteLoader";
import WriteUp from "@lib/about-us/components/WriteUp";
import OurSevices from "@lib/about-us/components/OurServices";
import WhatsappButton from "@common/components/WhatsappButton";

export default function AboutUs() {
  return (
    <RouteLoader>
      <Head>
        <title>TBM Events - About us</title>
      </Head>

      <main>
        <WhatsappButton />
        <PageHero title={"About us"} />
        <WriteUp />
        <OurSevices />
      </main>
    </RouteLoader>
  );
}
