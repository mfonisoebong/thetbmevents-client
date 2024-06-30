import { useContext } from "react";
import { HomeContext } from "@lib/home/contexts/Home/Context";

export default function useHomeContext() {
  return useContext(HomeContext);
}
