import { PropsWithChildren } from "react"

export interface FormInputProps extends PropsWithChildren {
  title: string
}

export type Gateway = "vella" | "paystack"

export interface ToggleButtonProps {
  onToggle: () => void
  gateway: Gateway
}

export interface PaymentMethod {
  id: number
  gateway: Gateway
  vella_tag?: string
  vella_webhook_url?: string
  vella_test_key?: string
  paystack_test_key?: string
  vella_live_key?: string
  paystack_webhook_url?: string
  paystack_live_key?: string
}

export interface PaymentMethodForm {
  method?: PaymentMethod
}
