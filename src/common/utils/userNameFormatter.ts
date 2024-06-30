import { IndividualUser, OrganizerUser } from "@common/typings";
import { isIndividual } from "@common/utils/isIndividual";

export const userNameFormatter = (
  user?: IndividualUser | OrganizerUser,
): string => {
  if (!user) return "";

  return isIndividual(user)
    ? `${user.first_name} ${user.last_name}`
    : user.buisness_name;
};
