import { FC } from "react";
import Card from "@lib/contact-us/components/ContactCards/Card";
import Location from "@common/components/Icons/Location";
import Phone from "@common/components/Icons/Phone";
import Mail from "@common/components/Icons/Mail";

const ContactCards: FC = () => {
  return (
    <div
      className={
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-b-[0.1rem] py-4 border-solid border-gray-200"
      }
    >
      <Card title={"visit us"} icon={<Location color={"white"} />}>
        <p>Akure, Ondo state</p>
        <p>Oba Akran, Ikeja Lagos.</p>
      </Card>
      <Card title={"phone"} icon={<Phone color={"white"} />}>
        <p>Phone: +234 902 011 3715</p>
        <p>Phone: +234 701 340 2680</p>
      </Card>{" "}
      <Card title={"work with us"} icon={<Mail color={"white"} />}>
        <p>support@thetbmevents.com</p>
      </Card>
    </div>
  );
};

export default ContactCards;
