import { FC } from "react";
import SocialLink from "@lib/event/components/Checkout/Social";
import Facebook from "@common/components/Icons/Facebook";
import Twitter from "@common/components/Icons/Twitter";
import Instagram from "@common/components/Icons/Instagram";
import useEventContext from "@lib/event/hooks/useEventContext";

const ContactUs: FC = () => {
  const event = useEventContext();

  const noEventLinks =
    !event?.event.links_facebook &&
    !event?.event.links_twitter &&
    !event?.event.links_instagram;

  if (noEventLinks) return null;

  return (
    <div className={"space-y-2"}>
      <h4 className={"text-lg md:text-xl lg:text-2xl font-bold"}>Contact Us</h4>
      <div className="flex space-x-3 items-center">
        <SocialLink
          icon={<Facebook color={"gray"} size={24} />}
          platform="Facebook"
          social={event?.event.links_facebook}
        />
        <SocialLink
          platform="Twitter"
          icon={<Twitter color={"gray"} size={24} />}
          social={event?.event.links_twitter}
        />
        <SocialLink
          platform="Instagram"
          icon={<Instagram color={"gray"} size={24} />}
          social={event?.event.links_instagram}
        />
      </div>
    </div>
  );
};

export default ContactUs;
