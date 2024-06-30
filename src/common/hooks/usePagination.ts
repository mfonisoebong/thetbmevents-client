import { useRouter } from "next/router";

type Params = {
  refetchData: () => {};
  next_page_url?: string;
  prev_page_url?: string;
  current_page: number;
  last_page: number;
};
export default function usePagination({
  refetchData,
  current_page,
  prev_page_url,
  next_page_url,
  last_page,
}: Params) {
  const router = useRouter();
  const hasNextPage = next_page_url ? true : false;
  const hasPreviousPage = prev_page_url ? true : false;
  const nextPage = async () => {
    await router.push({
      query: {
        ...router.query,
        page: current_page + 1,
      },
    });
    await refetchData();
  };

  const previousPage = async () => {
    const page = current_page - 1;

    if (!page) return;

    await router.push({
      query: {
        ...router.query,
        page,
      },
    });
    await refetchData();
  };
  const firstPage = async () => {
    await router.push({
      query: {
        ...router.query,
        page: 1,
      },
    });
    await refetchData();
  };

  const lastPage = async () => {
    await router.push({
      query: {
        ...router.query,
        page: last_page,
      },
    });
    await refetchData();
  };

  return {
    hasNextPage,
    hasPreviousPage,
    firstPage,
    lastPage,
    previousPage,
    nextPage,
  };
}
