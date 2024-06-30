import { useQuery } from "@tanstack/react-query";
import { getOverview } from "@lib/admin-overview/helpers/getOverview";

export default function useOverview() {
  const overview = useQuery(["admin", "overview"], getOverview);

  return overview;
}
