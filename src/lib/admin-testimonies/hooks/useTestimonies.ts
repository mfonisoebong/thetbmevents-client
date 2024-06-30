import { useQuery } from "@tanstack/react-query";
import { getTestimonies } from "@lib/admin-testimonies/helpers/getTestimonies";

export default function useTestimonies() {
  const testimonies = useQuery(["admin-testimonies"], getTestimonies);

  return testimonies;
}
