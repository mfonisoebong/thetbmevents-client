import { axiosInstance } from "@common/utils/axiosInstance"
import { StaffFormType } from "../utils/staffFormSchema"
import { HttpResponse } from "@common/typings"

export const createStaff = async (
  data: StaffFormType
): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance()

  return AppAxios({
    url: "/admin/users/staffs",
    method: "POST",
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
      admin_role: data.adminRole,
      phone_number: data.phoneNumber,
      phone_dial_code: data.dialCode,
      email: data.email,
      country: data.country,
    },
  }).then((res) => res.data)
}
