import IconButton from "@common/components/IconButton"
import ArrowLeft from "@common/components/Icons/ArrowLeft"
import useModal from "@common/hooks/useModal"
import { ModalHeaderProps } from "@lib/admin-dashboard/typings"
import Image from "next/image"
import { FC } from "react"

const ModalHeader: FC<ModalHeaderProps> = ({ title, subtitle }) => {
  const { closeModal } = useModal()

  return (
    <div className="relative space-y-6">
      <IconButton
        onClick={closeModal}
        icon={<ArrowLeft color="black" size={30} />}
        className="absolute left-6"
      />
      <Image
        alt=""
        src="/images/category.png"
        width={35}
        height={35}
        className="mx-auto"
      />
      <div className="space-y-1  text-center">
        <h3 className="font-medium text-sm md:text-base">{title}</h3>
        {subtitle && <h4 className="text-xs md:text-sm">{subtitle}</h4>}
      </div>
    </div>
  )
}

export default ModalHeader
