import { useQuery } from "@tanstack/react-query"
import { getSlides } from "../helpers/getSlides"

export default function useSlides() {
  const slides = useQuery(["admin-slides"], getSlides)

  return slides
}
