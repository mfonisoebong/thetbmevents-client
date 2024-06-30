import { useQuery } from "@tanstack/react-query";
import useAuth from "@common/hooks/useAuth";
import { getOverview } from "@lib/dashboard-overview/helpers/getOverview";

export default function useOverview() {
  const { user } = useAuth();
  const overview = useQuery(["overview", user.data?.id], getOverview);

  return overview;
}
