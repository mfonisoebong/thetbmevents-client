import { IndividualUser, OrganizerUser } from "@common/typings";

export const isIndividual = (
  user: IndividualUser | OrganizerUser | undefined,
): user is IndividualUser => {
  return user?.role === "individual";
};
