import { ReactNode } from "react";

export interface DetailProps {
  title: string;
  body: ReactNode | string | null;
}
