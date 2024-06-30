import { FC } from "react"

const RemoveScrollbar: FC = () => {
  return (
    <style>
      {`
      body::-webkit-scrollbar {
          display:none
      }
      `}
    </style>
  )
}

export default RemoveScrollbar
