import { getCookie } from "./utils";
import axios from "./axios";
import type { AxiosRequestConfig, Method } from "axios";

export type HTTPArgs<RequestData> = {
  url: string;
  method?: Method;
  data?: RequestData;
  headers?: Record<string, string>;
};

export type HTTPResponse<TResponse> = {
  ok: boolean;
  data: TResponse | null;
  error: any;
};

export default async function HTTP<Response, RequestData>({
  url,
  method = "post",
  data,
  headers,
}: HTTPArgs<RequestData>): Promise<HTTPResponse<Response>> {
  const resp: HTTPResponse<Response> = {
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
    resp.data = response.data as Response;
  } catch (err) {
    resp.ok = false;
    resp.error = err;
  }

  return resp;
}
