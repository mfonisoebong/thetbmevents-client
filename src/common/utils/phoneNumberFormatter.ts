export const phoneNumberFormatter = (code?: string, number?: string) => {
  if (!code || !number) return "";

  const formattedNumber = number.startsWith("0")
    ? number.replace("0", "")
    : number;

  return `${code} ${formattedNumber}`;
};
