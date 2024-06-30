import { useQuery } from "@tanstack/react-query";
import { getFeatures } from "@lib/admin-features/helpers/getFeatures";

export default function useFeatures() {
  const features = useQuery(["admin-features"], getFeatures);

  return features;
}
