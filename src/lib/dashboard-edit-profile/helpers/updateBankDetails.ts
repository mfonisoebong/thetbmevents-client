import { axiosInstance } from "@common/utils/axiosInstance"
import { BankDetailsFormType } from "@lib/dashboard-profile/utils/bankDetailsFormSchema"

export const updateBankDetails = async (data: BankDetailsFormType) => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/bank-details",
    method: "PATCH",
    data: {
      bank_name: data.bankName,
      account_number: data.accountNumber,
      account_name: data.accountName,
      swift_code: data.swiftCode,
      iban: data.iban,
    },
  })
}
