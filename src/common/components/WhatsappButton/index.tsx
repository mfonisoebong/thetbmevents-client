import { FC } from "react";
import Whatsapp from "@common/components/Icons/Whatsapp";

const WhatsappButton: FC = () => {
  return (
    <a
      href={
        "https://wa.me/+2349110191505?text=Hi, I would like to inquire about something from TBM events"
      }
      target={"_blank"}
      className={
        "fixed z-40 bottom-7 right-3 rounded-3xl text-white px-6 py-2 text-sm font-semibold flex items-center space-x-2 bg-green-600 hover:bg-green-700 duration-150"
      }
    >
      <Whatsapp color={"white"} />
      <span>Speak to TBM Admin</span>
    </a>
  );
};

export default WhatsappButton;
