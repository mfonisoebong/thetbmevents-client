import {FC, useState} from "react"
import FormInput from "./FormInput"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import ToggleButton from "./ToggleButton"
import {Gateway} from "@lib/admin-payment-method/typings"
import FlutterwaveForm from "./FlutterwaveForm"
import usePaymentMethods from "@lib/admin-payment-method/hooks/usePaymentMethods"
import PaystackForm from "./PaystackForm"

const PaymentMethod: FC = () => {
    const [gateway, setGateway] = useState<Gateway>("flutterwave")
    const {data: method} = usePaymentMethods(gateway)

    const toggleGateway = () => {
        if (gateway === "paystack") {
            setGateway("flutterwave")
            return
        }
        setGateway("paystack")
    }

    return (
        <OverviewCard theme="light">
            <div className="space-y-4">
                <FormInput title="Payment gateway">
                    <ToggleButton gateway={gateway} onToggle={toggleGateway}/>
                </FormInput>
                {gateway === "flutterwave" && <FlutterwaveForm method={method} key={method?.id}/>}
                {gateway === "paystack" && (
                    <PaystackForm method={method} key={method?.id}/>
                )}
            </div>
        </OverviewCard>
    )
}

export default PaymentMethod
