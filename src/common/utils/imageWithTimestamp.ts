import { isBase64 } from "@common/utils/isBase64";

// Prevents image caching
export const imageWithTimestamp = (image?: string): string => {
  const time = new Date().toString();
  return isBase64(image ?? "") ? `${image}` : `${image}?time=${time}`;
};
