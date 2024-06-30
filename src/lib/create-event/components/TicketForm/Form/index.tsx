import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { EventFormType } from "@lib/create-event/utils/eventSchema"
import FormSet from "./FormSet"
import { TicketFormProps } from "@lib/create-event/typings"
import IconButton from "@common/components/IconButton"
import ArrowLeft from "@common/components/Icons/ArrowLeft"

const Form: FC<TicketFormProps> = ({ closeForm }) => {
  const { watch } = useFormContext<EventFormType>()
  const tickets = watch("ticket")

  return (
    <form className="space-y-6">
      <IconButton
        className="stroke-black"
        icon={<ArrowLeft />}
        onClick={closeForm}
        variant="stroke"
      >
        Go back
      </IconButton>
      <FormSet closeForm={closeForm} />
    </form>
  )
}

export default Form
