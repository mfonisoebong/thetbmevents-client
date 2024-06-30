import { isBase64 } from "@common/utils/isBase64";

export const noCacheImage = (image: string) => {
  return isBase64(image) ? image : `${image}?q=${Date.now()}`;
};
