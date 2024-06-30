import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"

export default function useModal() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const showModal = searchParams.get("showModal")
  const toggleShowModal = () => {
    if (showModal) {
      router.push({
        query: {
          ...router.query,
          showModal: null,
        },
      })
      return
    }
    router.push({
      query: {
        ...router.query,
        showModal: "true",
      },
    })
  }

  const closeModal = () => {
    router.push({
      query: {
        ...router.query,
        showModal: null,
      },
    })
  }

  const openModal = (withParams?: { param: string; value: string }) => {
    router.push({
      query: {
        ...router.query,
        showModal: "true",
        ...(withParams
          ? {
              [withParams.param]: withParams.value,
            }
          : {}),
      },
    })
  }

  return {
    showModal: showModal ? true : false,
    toggleShowModal,
    closeModal,
    openModal,
  }
}
