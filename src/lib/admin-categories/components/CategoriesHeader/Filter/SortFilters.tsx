import { FC } from "react"
import Select from "@lib/admin-dashboard/components/Select"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import Button from "@common/components/Button"
import styles from "../styles.module.css"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import { SORT_FILTERS } from "@lib/admin-categories/constants/filters"
import useModal from "@common/hooks/useModal"

const SortFilters: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedOption = searchParams.get("sort") ?? undefined
  const { openModal } = useModal()
  const isLargeDevice = useMediaQuery(Device.large)

  const onSelect = async (option: string) => {
    try {
      await router.push({
        query: {
          ...router.query,
          sort: option,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const open = () => {
    openModal()
  }

  return (
    <div className={styles.sortfilter}>
      {isLargeDevice && (
        <Select
          options={SORT_FILTERS}
          selectedOption={selectedOption}
          onSelect={onSelect}
        />
      )}
      <Button onClick={open} size={"sm"} className={styles.exportbtn}>
        Add Category
      </Button>
    </div>
  )
}

export default SortFilters
