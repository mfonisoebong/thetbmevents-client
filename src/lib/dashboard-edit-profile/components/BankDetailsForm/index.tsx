import Button from "@common/components/Button"
import FormField from "@common/components/FormControls/FormField"
import FormSelectField from "@common/components/FormControls/FormSelectField"
import useAlertContext from "@common/hooks/useAlertContext"
import { compareObjects } from "@common/utils/compareObjects"
import { zodResolver } from "@hookform/resolvers/zod"
import { storeBankDetails } from "@lib/dashboard-edit-profile/helpers/storeBankDetails"
import { updateBankDetails } from "@lib/dashboard-edit-profile/helpers/updateBankDetails"
import useBanks from "@lib/dashboard-edit-profile/hooks/useBanks"
import { BankDetailsFormProps } from "@lib/dashboard-edit-profile/typings"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import useBankDetails from "@lib/dashboard-profile/hooks/useBankDetails"
import { BankDetails } from "@lib/dashboard-profile/typings"
import {
  BankDetailsFormType,
  BankDetailsSchema,
} from "@lib/dashboard-profile/utils/bankDetailsFormSchema"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"
import { useForm } from "react-hook-form"

const BankDetailsForm: FC<BankDetailsFormProps> = ({ bankDetails }) => {
  const defaultValues = {
    accountName: bankDetails?.account_name,
    accountNumber: bankDetails?.account_number,
    bankName: bankDetails?.bank_name,
    iban: bankDetails?.iban,
    swiftCode: bankDetails?.swift_code,
  }
  const { refetch } = useBankDetails()
  const {
    watch,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<BankDetailsFormType>({
    resolver: zodResolver(BankDetailsSchema),
    defaultValues,
  })
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: !bankDetails ? storeBankDetails : updateBankDetails,
    onSuccess() {
      handleOpenAlert({
        body: "Updated successfully",
        title: "Success",
        type: "success",
      })
      refetch()
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      })
    },
  })

  const formData = watch()
  const isSameData = compareObjects(defaultValues, formData)
  const onFormSubmit = (data: BankDetailsFormType) => {
    if (isSameData.isSame) return
    mutate(data)
  }

  const setValueAs = (name: keyof BankDetailsFormType, value: string) => {
    if (value.trim().length === 0) {
      setValue(name, null)
    }
  }

  return (
    <OverviewCard theme={"light"}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={"space-y-6 lg:px-12"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormField
            error={errors.accountName?.message}
            label={"Account name"}
            {...register("accountName")}
          />
          <FormField
            error={errors.bankName?.message}
            label={"Bank"}
            {...register("bankName")}
          />
          <FormField
            error={errors.accountNumber?.message}
            label={"Account number"}
            {...register("accountNumber")}
          />
          <FormField
            error={errors.swiftCode?.message}
            label={"Swift code"}
            {...register("swiftCode", {
              onChange(e) {
                setValueAs("swiftCode", e.target.value)
              },
            })}
          />
          <FormField
            error={errors.iban?.message}
            label={"IBAN"}
            {...register("iban", {
              onChange(e) {
                setValueAs("iban", e.target.value)
              },
            })}
          />
        </div>
        <div>
          <Button
            disabled={isSameData.isSame}
            loading={isLoading}
            size={"lg"}
            type={"submit"}
            className={"mx-auto w-full md:w-max md:px-12"}
          >
            Submit
          </Button>
        </div>
      </form>
    </OverviewCard>
  )
}

export default BankDetailsForm
