import {
  IndividualProfileFormType,
  OrganizationProfileFormType,
} from "@lib/dashboard-edit-profile/utils/profileSchema";
import { HttpResponse, IndividualUser, OrganizerUser } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const updateUser = async (
  data: IndividualProfileFormType | OrganizationProfileFormType,
): Promise<IndividualUser | OrganizerUser> => {
  const { AppAxios } = axiosInstance();

  const res: HttpResponse<IndividualUser | OrganizerUser> = await AppAxios({
    url: "/auth/user",
    method: "PATCH",
    data: {
      country: data.country,
      email: data.email,
      phone_number: data.phoneNumber,
      phone_dial_code: data.dialCode,
      first_name: "firstName" in data ? data.firstName : null,
      last_name: "lastName" in data ? data.lastName : null,
      buisness_name: "buisnessName" in data ? data.buisnessName : null,
    },
  }).then((res) => res.data);

  return res.data;
};
