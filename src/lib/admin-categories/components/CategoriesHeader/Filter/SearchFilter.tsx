import { ChangeEvent, FC, useState } from "react"
import SearchBar from "@common/components/SearchBar"
import { useRouter } from "next/router"
import debounce from "lodash.debounce"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import SortFilterSm from "./SortFilterSm"

const SearchFilter: FC = () => {
  const [search, setSearch] = useState("")
  const router = useRouter()
  const isLargeDevice = useMediaQuery(Device.large)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value
    setSearch(s)
    updateQueryParams(s)
  }

  const updateQueryParams = debounce((s: string) => {
    router.push({
      query: {
        ...router.query,
        page: 1,
        search: s,
      },
    })
  }, 1000)

  const clear = () => {
    setSearch("")
    updateQueryParams("")
  }

  return (
    <div className={"w-full lg:w-1/2 relative"}>
      <SearchBar
        onChange={onChange}
        className={"w-full lg:w-7/12"}
        placeholder={"Search"}
        value={search}
        closeAction={clear}
      />
      {!isLargeDevice && <SortFilterSm />}
    </div>
  )
}

export default SearchFilter
