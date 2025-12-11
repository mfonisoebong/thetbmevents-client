import {PropsWithChildren} from "react"

export interface FormInputProps extends PropsWithChildren {
    title: string
}

export type Gateway = "flutterwave" | "paystack"

export interface ToggleButtonProps {
    onToggle: () => void
    gateway: Gateway
}

export interface PaymentMethod {
    id: number
    gateway: Gateway
    paystack_test_key?: string
    paystack_live_key?: string
    flutterwave_live_key?: string
    flutterwave_test_key?: string
}

export interface PaymentMethodForm {
    method?: PaymentMethod
}
