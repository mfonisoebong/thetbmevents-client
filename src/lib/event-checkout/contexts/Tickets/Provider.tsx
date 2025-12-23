import {FC, PropsWithChildren, useState} from "react";
import {TicketsContext} from "@lib/event-checkout/contexts/Tickets/Context";
import {PaymentGateway, SelectedTicket} from "@lib/event-checkout/typings";

const TicketsProvider: FC<PropsWithChildren> = ({children}) => {
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
    const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>(null)

    const incrementQuantity = (id: string, maxQuantity?: number) => {
        const selectedTicket = selectedTickets.find((t) => t.id === id);

        const newQuantity = selectedTicket ? selectedTicket.quantity + 1 : 1;

        if (typeof maxQuantity === "number" && newQuantity > maxQuantity) {
            return;
        }

        if (!selectedTicket) {
            setSelectedTickets((prev) => [...prev, {id, quantity: 1}]);
            return;
        }

        const newTickets: SelectedTicket[] = selectedTickets.map((t) => ({
            ...t,
            quantity: t.id === id ? t.quantity + 1 : t.quantity,
        }));
        setSelectedTickets(newTickets);
    };

    const decrementQuantity = (id: string) => {
        const selectedTicket = selectedTickets.find((t) => t.id === id);

        if (selectedTicket && selectedTicket?.quantity - 1 === 0) {
            const newTickets: SelectedTicket[] = selectedTickets.filter(
                (t) => t.id !== id
            );
            setSelectedTickets(newTickets);
            return;
        }

        const newTickets: SelectedTicket[] = selectedTickets.map((t) => ({
            ...t,
            quantity: t.id === id ? t.quantity - 1 : t.quantity,
        }));
        setSelectedTickets(newTickets);
    };

    return (
        <TicketsContext.Provider
            value={{
                selectedTickets,
                incrementQuantity,
                decrementQuantity,
                paymentGateway,
                setPaymentGateway
            }}
        >
            {children}
        </TicketsContext.Provider>
    );
};

export default TicketsProvider;
