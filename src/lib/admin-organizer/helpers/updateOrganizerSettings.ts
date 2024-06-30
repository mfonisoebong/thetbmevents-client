import { HttpResponse } from "@common/typings";
import { OrganizerEdit } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const updateOrganizerSettings = async (
  data: OrganizerEdit & {
    id: string;
  },
): Promise<HttpResponse> => {
  const { AppAxios } = axiosInstance();

  return AppAxios({
    url: "/admin/users/organizers/settings",
    method: "PATCH",
    data: {
      organizer_id: data.id,
      ...(typeof data.commision === "number"
        ? { commision: data.commision }
        : {}),
      ...(data.iban ? { iban: data.iban } : {}),
      ...(data.swiftCode ? { swift_code: data.swiftCode } : {}),
    },
  }).then((res) => res.data);
};
