import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import useEvent from "@lib/event/hooks/useEvent";
import {PaymentGateway} from "@lib/event-checkout/typings";

export default function useTotalAmount() {
    const {selectedTickets, paymentGateway} = useTicketsContext();
    const {data: eventsData} = useEvent();
    const selectedTicketsIds = selectedTickets.map((ticket) => ticket.id);
    const tickets =
        eventsData?.tickets.filter((ticket) =>
            selectedTicketsIds.includes(ticket.id),
        ) ?? [];

    const amounts = tickets.map((ticket) => {
        const ticketQuantity =
            selectedTickets.find((selectedTicket) => selectedTicket.id === ticket.id)
                ?.quantity ?? 0;
        return ticketQuantity * ticket.price;
    });

    const amount = amounts.reduce((a, b) => a + b, 0);

    function getFees(gateway: PaymentGateway): number {
        const calcPaystackCharges = (price: number): number => {
            const flatFee = price >= 2500 ? 100 : 0;
            const feeCap = 2000;
            const decFee = 0.015;

            const appFee = Math.round(((decFee * price) + flatFee) * 100) / 100;

            if (appFee > feeCap) {
                return feeCap;
            }

            let finalPrice = Math.round((((price + flatFee) / (1 - decFee)) + 0.01) * 100) / 100;

            if (price < 2500 && finalPrice >= 2500) {
                finalPrice += 120;
            }

            return Math.round((finalPrice - price) * 100) / 100;
        };

        if (gateway === 'flutterwave') {
            return amount * 0.02;
        }
        if (gateway === 'paystack') {
            return calcPaystackCharges(amount);
        }
        return 0;
    }

    const  fees = getFees(paymentGateway);

    return {amount, fees, subtotal: amount + fees};
}
