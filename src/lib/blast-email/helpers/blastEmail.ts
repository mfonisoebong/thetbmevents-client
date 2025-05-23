import { axiosInstance } from "@common/utils/axiosInstance";
import { BlastEmailFormType } from "../utils/emailSchema";

export const sendBlastEmail = async (data: BlastEmailFormType) => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: "/events/send-blast-email",
    method: "POST",
    data: {
      email_content: data.emailContent,
      subject: data.subject,
      event_ids: data.events.map((event) => event.id),
    },
  });
};
