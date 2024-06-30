import { ChangeEvent, FC, useState } from "react";
import SearchBar from "@common/components/SearchBar";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
const SearchSales: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(
      {
        query: {
          search: e.target.value,
          ...router.query,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <div className={"w-full md:w-7/12 lg:w-8/12 flex justify-center"}>
      <SearchBar
        className={"w-full md:w-7/12"}
        iconPosition={"right"}
        value={search}
        onChange={onChange}
        placeholder={"Search for name, email or event "}
      />
    </div>
  );
};

export default SearchSales;
