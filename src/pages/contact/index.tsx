import PageHero from "@common/components/PageHero";
import Wrapper from "@lib/contact-us/components/Wrapper";
import ContactCards from "@lib/contact-us/components/ContactCards";
import WeAreHere from "@lib/contact-us/components/WeAreHere";
import ContactMessageForm from "@lib/contact-us/components/ContactMessageForm";
import RecaptchaWrapper from "@lib/auth-pages/components/RecaptchaWrapper";
import WhatsappButton from "@common/components/WhatsappButton";
import SSOHead from "@common/components/SSOHead";

export default function ContactUs() {
  return (
    <>
      <SSOHead
        title={"TBM Events - Contact Us"}
        description={"Leave a message for us"}
        og={{}}
      />
      <WhatsappButton />

      <RecaptchaWrapper>
        <PageHero title={"Contact us"} />
        <Wrapper>
          <ContactCards />
          <WeAreHere />
          <ContactMessageForm />
        </Wrapper>
      </RecaptchaWrapper>
    </>
  );
}
