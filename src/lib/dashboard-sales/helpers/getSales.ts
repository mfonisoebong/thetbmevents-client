import { SalesData } from "@lib/dashboard-sales/typings";
import { HttpResponse } from "@common/typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getSales = async (page?: string): Promise<SalesData> => {
  const { AppAxios } = axiosInstance();
  const url = !page ? "/sales" : `/sales?page=${page}`;

  const res: HttpResponse<SalesData> = await AppAxios({
    url,
  }).then((res) => res.data);

  return res.data;
};
