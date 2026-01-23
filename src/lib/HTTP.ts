import { getCookie } from "./utils";
import axios from "./axios";
import type { AxiosRequestConfig, Method } from "axios";

export type HTTPArgs<TData> = {
  url: string;
  method?: Method;
  data?: TData;
  headers?: Record<string, string>;
};

export type HTTPResponse<TResponse> = {
  ok: boolean;
  data: TResponse | null;
  error: any;
};

export default async function HTTP<TResponse, TData>({
  url,
  method = "post",
  data,
  headers,
}: HTTPArgs<TData>): Promise<HTTPResponse<TResponse>> {
  const resp: HTTPResponse<TResponse> = {
    ok: true,
    data: null,
    error: null,
  };

  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
      ...(headers ?? {}),
    },
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    resp.data = response.data as TResponse;
  } catch (err) {
    resp.ok = false;
    resp.error = err;
  }

  return resp;
}
