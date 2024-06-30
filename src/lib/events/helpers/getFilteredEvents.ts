import { HttpResponse } from "@common/typings";

import { FilterQueryOptions, FilteredEventsData } from "../typings";
import { axiosInstance } from "@common/utils/axiosInstance";

export const getFilteredEvents = async (
  query: FilterQueryOptions,
): Promise<FilteredEventsData> => {
  const { AppAxios } = axiosInstance();
  const pageQuery = query.page ? `&page=${query.page}` : "";

  const queryString = query.search
    ? `?search=${query.search}${pageQuery}`
    : query.category
    ? `?category=${query.category}${pageQuery}`
    : query.date
    ? `?date=${query.date}${pageQuery}`
    : query.location
    ? `?location=${query.location}${pageQuery}`
    : "";
  const res: HttpResponse<FilteredEventsData> = await AppAxios({
    url: `/events/filter${queryString}`,
  }).then((res) => res.data);

  return res.data;
};
