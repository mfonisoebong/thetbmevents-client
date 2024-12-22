import RouteLoader from "@common/components/RouteLoader";
import Hero from "../lib/home/components/Hero";
import NewsLetter from "../lib/home/components/NewsLetter";
import Testimonies from "../lib/home/components/Testimonies";
import UpcomingEvents from "../lib/home/components/UpcomingEvents";
import FeaturesSection from "../lib/home/components/FeaturesSection";
import { GetStaticProps } from "next";
import { getHomepageData } from "@lib/home/helpers/getHomepageData";
import { HomePageData } from "@lib/home/typings";
import HomeProvider from "@lib/home/contexts/Home/Provider";
import WhatsappButton from "@common/components/WhatsappButton";
import SSOHead from "@common/components/SSOHead";

export default function Home(props: HomePageData) {
  return (
    <>
      <SSOHead
        title={"TBM Events - Home"}
        description={
          "Discover Unforgettable Experiences: Your Gateway to Exclusive Events and\n" +
          "        Seamless Ticketing!"
        }
        og={{}}
      />
      <WhatsappButton />
      <Hero />
      <HomeProvider {...props}>
        <UpcomingEvents />
        <FeaturesSection />
        <Testimonies />
      </HomeProvider>

      <NewsLetter />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageData> = async () => {
  try {
    const homepageData = await getHomepageData();
    return {
      props: homepageData,
      revalidate: 10,
    };
  } catch (err: any) {
    return {
      props: {
        features: { heading: "", items: [], sub_heading: "" },
        testimonies: { heading: "", items: [], sub_heading: "" },
        upcoming_events: [],
      },
    };
  }
};
