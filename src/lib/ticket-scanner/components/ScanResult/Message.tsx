import { ScanResultMessageProps } from "@lib/ticket-scanner/typings"
import Image from "next/image"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

const Message: FC<ScanResultMessageProps> = ({ msg, status }) => {
  const textClass = twMerge(
    "uppercase text-center font-semibold",
    status === "success" ? "text-green-600" : "text-red-600"
  )
  return (
    <div className="space-y-8">
      <Image
        src={
          status === "success" ? "/images/success.png" : "/images/failed.png"
        }
        width={200}
        alt=""
        height={200}
        className="w-44 h-44 mx-auto"
      />
      <h2 className={textClass}>{msg}</h2>
    </div>
  )
}

export default Message
