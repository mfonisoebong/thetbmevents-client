import { useState } from "react";

export default function useToggle(initialValue?: boolean) {
  const [toggle, setToggle] = useState<boolean>(() =>
    typeof initialValue === "boolean" ? initialValue : false,
  );

  const handleToggle = () => {
    setToggle((state) => !state);
  };

  return {
    toggle,
    handleToggle,
  };
}
