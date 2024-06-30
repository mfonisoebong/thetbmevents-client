import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getTicketQrCode } from "@lib/dashboard-ticket/helpers/getTicketQrCode";

export default function useTicketQrCode() {
  const { query } = useRouter();
  const ticketId = query?.id as string;

  const fetcher = () => getTicketQrCode(ticketId);
  const qrCode = useQuery(["qr-code", ticketId], fetcher);

  return qrCode;
}
