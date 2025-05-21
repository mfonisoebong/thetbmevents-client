import { EventFormType } from "../utils/eventSchema";
import { dataURLtoFile } from "@common/utils/dataUrlToFile";
import { HttpResponse } from "@common/typings";
import { filterValidTickets } from "../utils/filterValidTickets";
import { axiosInstance } from "@common/utils/axiosInstance";

interface EventResponseData {
  event_id: string;
}

export const createEvent = async (
  data: EventFormType,
): Promise<{
  event: {
    alias: string;
  };
}> => {
  const { AppAxios } = axiosInstance();
  const formData = new FormData();
  formData.append("logo", dataURLtoFile(data.about.image, "logo"));
  formData.append("title", data.about.name);
  formData.append("categories", data.about.category);
  formData.append("type", data.about.eventType);
  formData.append("description", data.about.description);
  data.about.location && formData.append("location", data.about.location);
  data.about.locationTips &&
    formData.append("location_tips", data.about.locationTips);
  formData.append("event_date", data.date.eventDate);
  data.date.eventTime && formData.append("event_time", data.date.eventTime);
  formData.append("timezone", data.date.timeZone);
  data.about.eventLink && formData.append("event_link", data.about.eventLink);
  formData.append(
    "undisclose_location",
    JSON.stringify(data.about.undiscloseLocation),
  );
  data.about.social.facebook &&
    formData.append("links_facebook", data.about.social.facebook);
  data.about.social.instagram &&
    formData.append("links_instagram", data.about.social.instagram);
  data.about.social.twitter &&
    formData.append("links_twitter", data.about.social.twitter);

  const ticketData = filterValidTickets(data.ticket).map((t) => ({
    name: t.name,
    price: t.price,
    quantity: t.quantity,
    description: t.description,
    unlimited: t.unlimited,
    selling_start_date_time: t.sellingDate.start,
    selling_end_date_time: t.sellingDate.end,
  }));

  for (let i = 0; i < ticketData.length; i++) {
    const ticket = ticketData[i];
    formData.append(`tickets[${i}][name]`, ticket.name);
    formData.append(`tickets[${i}][price]`, ticket.price.toString());
    formData.append(`tickets[${i}][quantity]`, ticket.quantity.toString());
    formData.append(`tickets[${i}][description]`, ticket.description);
    formData.append(`tickets[${i}][unlimited]`, ticket.unlimited.toString());
    formData.append(
      `tickets[${i}][selling_start_date_time]`,
      ticket.selling_start_date_time,
    );
    formData.append(
      `tickets[${i}][selling_end_date_time]`,
      ticket.selling_end_date_time,
    );
  }

  return await AppAxios({
    url: "/events/store",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data.data);
};
