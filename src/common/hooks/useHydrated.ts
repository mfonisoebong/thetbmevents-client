import { useEffect } from "react";
import { useState } from "react";

export default function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      setHydrated(true);
    }
  }, []);

  return { hydrated };
}
