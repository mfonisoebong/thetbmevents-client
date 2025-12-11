import {axiosInstance} from "@common/utils/axiosInstance";
import {HttpResponse} from "@common/typings";
import {PaymentData} from "@lib/event-checkout/typings";

interface Data {
    authorization_url?: string;
    link?: string;
    access_code?: string;
    reference?: string;
}

const sendPaymentRequest = async (
    endpoint: string,
    data: PaymentData,
): Promise<Data> => {
    const {AppAxios} = axiosInstance();

    const res: HttpResponse<Data> = await AppAxios({
        url: endpoint,
        method: "POST",
        data: {
            ...data,
            coupon_code: data.couponCode,
            attendees: data.attendees.map((a) => ({
                first_name: a.firstName,
                last_name: a.lastName,
                email: a.email,
                ticket_id: a.ticketId,
            })),
        },
    }).then((res) => res.data);

    return res.data;
};

export const getPaystackPaymentUrl = async (
    data: PaymentData,
): Promise<Data> => sendPaymentRequest("/payments/paystack", data);

export const getFlutterwavePaymentUrl = async (
    data: PaymentData,
): Promise<Data> => sendPaymentRequest("/payments/flutterwave", data);
