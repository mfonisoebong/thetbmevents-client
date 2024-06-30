import { axiosInstance } from "@common/utils/axiosInstance"
import { BankDetailsFormType } from "@lib/dashboard-profile/utils/bankDetailsFormSchema"

export const storeBankDetails = async (data: BankDetailsFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/bank-details",
    method: "POST",
    data: {
      bank_name: data.bankName,
      account_number: data.accountNumber,
      account_name: data.accountName,
      swift_code: data.swiftCode,
      iban: data.iban,
    },
  })
}
