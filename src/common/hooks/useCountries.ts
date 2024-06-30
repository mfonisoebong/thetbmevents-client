import { getCountries, getStatesInCountry } from "@common/helpers/getCountries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useCountries() {
  const [countryCode, setCountryCode] = useState<string>("");

  const countries = useQuery(["countries"], getCountries);

  const fetchStates = () => getStatesInCountry(countryCode);

  const states = useQuery(["states", countryCode], fetchStates, {
    refetchOnWindowFocus: false,
    enabled: countryCode !== "",
  });

  const changeCountryCode = (code: string) => {
    setCountryCode(code);
  };

  return {
    countries,
    states,
    changeCountryCode,
  };
}
