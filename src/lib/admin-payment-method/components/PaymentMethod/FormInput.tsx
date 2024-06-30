import { FormInputProps } from "@lib/admin-payment-method/typings"
import { FC } from "react"

const FormInput: FC<FormInputProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col lg:flex-row space-y-2 items-center space-x-0 lg:space-y-0">
      <div className="w-full lg:w-4/12">
        <h3 className="text-sm md:text-base font-medium">{title}</h3>
      </div>
      <div className="w-full lg:w-8/12">{children}</div>
    </div>
  )
}

export default FormInput
