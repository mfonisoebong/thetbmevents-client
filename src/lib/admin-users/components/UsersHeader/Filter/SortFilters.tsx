import { FC } from "react"
import Select from "@lib/admin-dashboard/components/Select"
import { SORT_FILTERS } from "@lib/admin-users/constants/filters"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import Button from "@common/components/Button"
import styles from "../styles.module.css"
import { useMutation } from "@tanstack/react-query"
import { exportUsersCSV } from "@lib/admin-users/helpers/exportUsersCSV"
import { downloadCSVFile } from "@common/utils/downloadCSVFile"
import useSelectedUsersContext from "@lib/admin-users/hooks/useSelectedUsersContext"
import useAlertContext from "@common/hooks/useAlertContext"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"

const SortFilters: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedOption = searchParams.get("sort") ?? undefined
  const { selectedUserIds } = useSelectedUsersContext()
  const { handleOpenAlert } = useAlertContext()
  const { isLoading, mutate } = useMutation({
    mutationFn: exportUsersCSV,
    onError() {
      handleOpenAlert({
        title: "Error",
        body: "An error occured",
        type: "error",
      })
    },
    onSuccess(data) {
      const fileName = `${Date.now()}_users`
      downloadCSVFile(data, fileName)
    },
  })
  const isLargeDevice = useMediaQuery(Device.large)
  const exportCSV = () => {
    if (selectedUserIds.length === 0) {
      handleOpenAlert({
        title: "Error",
        body: "Select some users to export",
        type: "error",
      })
      return
    }
    const ids = selectedUserIds.toString()
    mutate(ids)
  }

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

  return (
    <div className={styles.sortfilter}>
      {isLargeDevice && (
        <Select
          options={SORT_FILTERS}
          selectedOption={selectedOption}
          onSelect={onSelect}
        />
      )}
      <Button
        size={"sm"}
        onClick={exportCSV}
        disabled={isLoading}
        variant={"outline"}
        className={styles.exportbtn}
      >
        Export as CSV
      </Button>
    </div>
  )
}

export default SortFilters
