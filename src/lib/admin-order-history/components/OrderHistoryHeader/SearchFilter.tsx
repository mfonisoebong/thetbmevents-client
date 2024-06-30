import { ChangeEvent, FC } from "react";
import SearchBar from "@common/components/SearchBar";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const SearchFilter: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    router.push({
      query: {
        ...router.query,
        search: e.target.value,
      },
    });
  };

  const clear = () => {
    router.push({
      query: {
        ...router.query,
        search: "",
      },
    });
  };

  return (
    <SearchBar
      closeAction={clear}
      value={search ?? ""}
      onChange={handleSearch}
      className={"w-full lg:w-4/12"}
      placeholder={"Search"}
    />
  );
};

export default SearchFilter;
