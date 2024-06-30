import RouteLoader from "@common/components/RouteLoader";
import WhatsappButton from "@common/components/WhatsappButton";
import PageHero from "@common/components/PageHero";
import ForSection from "@lib/how-it-works/components/ForSection";
import { termsAndConditions } from "@lib/terms-and-conditions/constants/terms";
import SSOHead from "@common/components/SSOHead";

export default function TermsAndConditions() {
  return (
    <>
      <SSOHead
        title={"TBM Events - Terms and conditions"}
        description={"Terms and conditions"}
        og={{}}
      />
      <main>
        <WhatsappButton />
        <PageHero title={"Terms & conditions"} />

        <ForSection
          spacingClass={"space-y-12"}
          title={"Our terms and conditions"}
          items={termsAndConditions}
        />
      </main>
    </>
  );
}
