import SearchBar from "@common/components/SearchBar";
import { ChangeEvent, FC } from "react";
import FilterOptions from "./FilterOptions";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import styles from "../styles.module.css";
import Filters from "@lib/events/components/Hero/SearchFilter/Filters";

const SearchFilter: FC = () => {
  const router = useRouter();
  const isMediumSize = useMediaQuery(Device.medium);
  const isLargeDevice = useMediaQuery(Device.large);
  const onSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    router.push(
      {
        query: {
          search: e.target.value.trim(),
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      },
    );
  }, 300);

  return (
    <div className={styles.searchfilter}>
      <div className="relative">
        <SearchBar
          onChange={onSearchChange}
          style={{
            height: isMediumSize ? "4.4rem" : "3.5rem",
            paddingLeft: "3.2rem",
          }}
          className="text-base md:text-lg"
          placeholder="Event, artist or team"
        />
        {!isLargeDevice && <Filters />}
      </div>

      <FilterOptions />
    </div>
  );
};

export default SearchFilter;
