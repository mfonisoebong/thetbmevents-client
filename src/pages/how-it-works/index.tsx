import PageHero from "@common/components/PageHero";
import ForSection from "@lib/how-it-works/components/ForSection";
import { organizerWorks, userWorks } from "@lib/how-it-works/constants/works";
import WhatsappButton from "@common/components/WhatsappButton";
import SSOHead from "@common/components/SSOHead";

export default function HowItWorks() {
  return (
    <>
      <SSOHead
        title={"TBM Events - How it works"}
        description={"How it works"}
        og={{}}
      />
      <main>
        <WhatsappButton />

        <PageHero title={"How it works"} />
        <ForSection bgColor title={"FOR USERS"} items={userWorks} />
        <ForSection title={"FOR ORGANIZERS"} items={organizerWorks} />
      </main>
    </>
  );
}
