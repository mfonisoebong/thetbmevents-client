import {ChangeEvent, FC, useState} from "react";
import LayoutContainer from "@lib/event-checkout/components/LayoutContainer";
import {useFormContext} from "react-hook-form";
import {ContactInformationFormType} from "@lib/event-checkout/utils/contactInformationSchema";
import CommonCard from "@lib/event-checkout/components/CommonCard";
import Button from "@common/components/Button";
import FormCheck from "@common/components/FormControls/FormCheck";
import styles from "./styles.module.css";
import {PaymentData, PaymentGateway} from "@lib/event-checkout/typings";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";
import useTotalAmount from "@lib/event-checkout/hooks/useTotalAmount";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/router";
import useAlertContext from "@common/hooks/useAlertContext";
import {errorParser} from "@common/utils/errorParser";
import {freePayment} from "@lib/event-checkout/helpers/freePayment";
import {getFlutterwavePaymentUrl, getPaystackPaymentUrl} from "@lib/event-checkout/helpers/getPaymentUrl";

const PaymentOptions: FC = () => {
    const {getValues} = useFormContext<ContactInformationFormType>();
    const {selectedTickets} = useTicketsContext();
    const {handleOpenAlert} = useAlertContext();
    const {totalAmount} = useTotalAmount();
    const router = useRouter();
    const freePaymentMutate = useMutation({
        mutationFn: freePayment,
        onSuccess() {
            router.push("/events/payment-complete");
        },
        onError(err) {
            handleOpenAlert({
                type: "error",
                body: errorParser(err),
                title: "Error",
            });
        },
    });

    const payStackPayment = useMutation({
        mutationFn: getPaystackPaymentUrl,
        onSuccess(data) {
            window.open(data.authorization_url, "_self");
        },
        onError(err) {
            handleOpenAlert({
                body: errorParser(err),
                type: "error",
                title: "Error",
            });
        },
    });

    const flutterwavePayment = useMutation({
        mutationFn: getFlutterwavePaymentUrl,
        onSuccess(data) {
            window.open(data.link, "_self");
        },
        onError(err) {
            handleOpenAlert({
                body: errorParser(err),
                type: "error",
                title: "Error",
            });
        },
    });

    const [gateway, setGateway] = useState<PaymentGateway>(null);
    // show/hide the "see more" dropdown that includes less-common payment options
    const [showMore, setShowMore] = useState(false);

    const payBtnDisabled = !gateway;
    const formValues = getValues();

    const handleGatewayChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGateway(e.target.name as PaymentGateway);
    };

    const isChecked = (name: PaymentGateway) => {
        return gateway === name;
    };

    const handlePay = async () => {
        const data: PaymentData = {
            customer_email: formValues.customer.email,
            customer_first_name: formValues.customer.firstName,
            customer_last_name: formValues.customer.lastName,
            customer_phone_dial_code: formValues.customer.phone.dialCode,
            attendees: formValues.attendees,
            tickets: selectedTickets,
            couponCode:
                !formValues.couponCode || formValues.couponCode?.trim() === ""
                    ? undefined
                    : formValues.couponCode,
            customer_phone_number: formValues.customer.phone.number,
        };

        if (totalAmount === 0) {
            freePaymentMutate.mutate(data);
            return;
        }

        if (gateway === "paystack") {
            payStackPayment.mutate(data);
        }

        if (gateway === "flutterwave") {
            flutterwavePayment.mutate(data);
        }
    };

    const actionLoading = freePaymentMutate.isLoading || payStackPayment.isLoading || flutterwavePayment.isLoading;

    return (
        <LayoutContainer className={"lg:w-8/12"} title="Payment Options">
            <CommonCard title={"Select your preffered payment method"}>
                <div className={styles.paymentoptions}>
                    <FormCheck
                        checked={isChecked("flutterwave")}
                        onChange={handleGatewayChange}
                        name={"flutterwave"}
                    >
                        Flutterwave
                    </FormCheck>

                    {/* Move Paystack into a "See more" dropdown */}
                    <div className="mt-2">
                        <button
                            type="button"
                            className="text-sm text-blue-600 underline"
                            onClick={() => setShowMore(s => !s)}
                        >
                            {showMore ? "Hide" : "See more"}
                        </button>

                        {showMore && (
                            <div className="mt-2">
                                <FormCheck
                                    checked={isChecked("paystack")}
                                    onChange={handleGatewayChange}
                                    name={"paystack"}
                                >
                                    Paystack
                                </FormCheck>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handlePay}
                        disabled={payBtnDisabled}
                        loading={actionLoading}
                        className={"w-full"}
                        size={"lg"}
                    >
                        Pay now
                    </Button>
                </div>
            </CommonCard>
        </LayoutContainer>
    );
};

export default PaymentOptions;
