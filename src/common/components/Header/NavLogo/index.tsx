import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

const NavLogo: FC = () => {
  const isMediumSize = useMediaQuery(Device.medium)
  const logoSize = isMediumSize ? 140 : 120

  return (
    <Link href="/" className="flex md:justify-center">
      <Image
        src="/images/tbm_logo.png"
        alt="TBM Events logo"
        className="w-20 md:w-28"
        width={logoSize}
        height={40}
        priority
      />
    </Link>
  )
}

export default NavLogo
