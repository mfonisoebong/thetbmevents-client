import RouteLoader from "@common/components/RouteLoader";
import WhatsappButton from "@common/components/WhatsappButton";
import PageHero from "@common/components/PageHero";
import ForSection from "@lib/how-it-works/components/ForSection";
import {
  cookiesPolicies,
  policyRights,
  privacyPolicies,
} from "@lib/privacy-and-cookies/constants/items";
import SSOHead from "@common/components/SSOHead";

export default function PrivacyAndCookies() {
  return (
    <>
      <SSOHead
        title={"Privacy & cookies"}
        description={"Privacy & cookies"}
        og={{}}
      />
      <main>
        <WhatsappButton />
        <PageHero title={"Privacy & cookies"} />

        <ForSection title={"Privacy Policy"} items={privacyPolicies} />
        <ForSection title={"Cookies Policy"} items={cookiesPolicies} />
        <ForSection title={"Policy rights"} items={policyRights} />
      </main>
    </>
  );
}
