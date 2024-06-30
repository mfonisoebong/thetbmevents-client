import { FC } from "react"
import IconButton from "@common/components/IconButton"
import Pencil from "@common/components/Icons/Pencil"
import Upload from "@common/components/Icons/Upload"
import Trash from "@common/components/Icons/Trash"
import { AvatarActionsProps } from "@lib/dashboard-edit-profile/typings"

const AvatarActions: FC<AvatarActionsProps> = ({
  upload,
  saveDisabled,
  remove,
  onChange,
}) => {
  return (
    <div className="flex justify-center items-center space-x-5 text-sm">
      <IconButton
        className={"hover:text-black"}
        variant={"stroke"}
        icon={<Pencil size={15} color={"black"} />}
        onClick={onChange}
      >
        Change
      </IconButton>
      <IconButton
        onClick={upload}
        className={"hover:text-black disabled:opacity-50"}
        disabled={saveDisabled}
        variant={"stroke"}
        icon={<Upload size={15} color={"black"} />}
      >
        Save
      </IconButton>
      <IconButton
        onClick={remove}
        className={"text-red-500 hover:text-red-500"}
        variant={"stroke"}
        icon={<Trash className={"stroke-red-500"} />}
      >
        Remove
      </IconButton>
    </div>
  )
}

export default AvatarActions
