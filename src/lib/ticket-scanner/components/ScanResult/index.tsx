import Button from "@common/components/Button"
import IconButton from "@common/components/IconButton"
import Close from "@common/components/Icons/Close"
import { FC, useEffect } from "react"
import Message from "./Message"
import { ScanResultProps } from "@lib/ticket-scanner/typings"
import { twMerge } from "tailwind-merge"
import { useMutation } from "@tanstack/react-query"
import { verifyTicket } from "@lib/ticket-scanner/helpers/verifyTicket"
import Loader from "@common/components/Icons/Loader"

const ScanResult: FC<ScanResultProps> = ({ close, ticket }) => {
  const { mutate, isLoading, error, isSuccess, isIdle, isPaused, reset } =
    useMutation({
      mutationFn: verifyTicket,
      onSuccess() {},
    })
  const errorObj: any = error
  const wrapperClass = twMerge(
    "absolute w-full h-full bg-white duration-300 z-30 py-20 px-5 flex flex-col",
    ticket ? "top-0" : "top-[120%]",
    isLoading ? "" : "justify-between"
  )

  if (ticket && !isLoading && !isSuccess && !error) {
    mutate(ticket.id)
  }

  const closeModal = () => {
    reset()
    close()
  }

  return (
    <div className={wrapperClass}>
      <div>
        <IconButton
          onClick={closeModal}
          icon={<Close color="black" size={25} />}
        />
      </div>
      {isLoading ? (
        <Loader color="black" className="mx-auto mt-20" size={60} />
      ) : (
        <>
          {!isIdle && !isPaused && (
            <>
              <Message
                msg={
                  isSuccess
                    ? "Ticket verifiied"
                    : errorObj.response.data.message
                }
                status={isSuccess ? "success" : "failed"}
              />
              <div>
                <Button
                  onClick={closeModal}
                  className="w-full"
                  style={{
                    borderRadius: "2rem",
                  }}
                  size="lg"
                  variant="outline"
                >
                  Scan another code
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ScanResult
