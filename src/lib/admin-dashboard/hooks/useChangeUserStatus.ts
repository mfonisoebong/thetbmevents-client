import useAlertContext from "@common/hooks/useAlertContext"
import { Data, changeStatus } from "@lib/admin-organizer/helpers/changeStatus"
import { useMutation } from "@tanstack/react-query"

interface Props {
  onSuccess: (...args: any) => any
  id: string
}

export default function useChangeUserStatus(props: Props) {
  const mutationFn = async (data: Data) => {
    await changeStatus(data)
  }
  const { handleOpenAlert } = useAlertContext()
  const mutation = useMutation({
    mutationFn,
    onSuccess() {
      handleOpenAlert({
        body: "Action completed",
        title: "Success",
        type: "success",
      })
      props.onSuccess()
    },
    onError() {
      handleOpenAlert({
        body: "Action failed",
        title: "Error",
        type: "error",
      })
    },
  })

  const activateUser = () => {
    if (!props.id) return
    mutation.mutate({
      id: props.id,
      status: "active",
    })
  }

  const deactivateUser = () => {
    if (!props.id) return
    mutation.mutate({
      id: props.id,
      status: "blocked",
    })
  }

  return {
    mutation,
    activateUser,
    deactivateUser,
  }
}
