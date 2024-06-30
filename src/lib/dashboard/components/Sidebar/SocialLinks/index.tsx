import Facebook from "@common/components/Icons/Facebook"
import Instagram from "@common/components/Icons/Instagram"
import Twitter from "@common/components/Icons/Twitter"
import Link from "next/link"
import { FC } from "react"

const SocialLinks: FC = () => {
  return (
    <div className="flex pl-8 space-x-4 items-center">
      <Link href="https://instagram.com" target="_blank">
        <Instagram color="black" size={24} />
      </Link>
      <Link href="https://instagram.com" target="_blank">
        <Twitter color="black" size={24} />
      </Link>
      <Link href="https://instagram.com" target="_blank">
        <Facebook color="black" size={24} />
      </Link>
    </div>
  )
}

export default SocialLinks
