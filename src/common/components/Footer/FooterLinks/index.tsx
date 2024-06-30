import { FC } from "react"
import LinkList from "./LinkList"
import { firstLinks, secondLinks } from "@common/constants/footerLinks"
import ToTop from "./ToTop"

const FooterLinks: FC = () => {
  return (
    <div className="flex items-center">
      <div className="grid w-full grid-cols-1 md:grid-cols-3">
        <LinkList links={firstLinks} />
        <LinkList links={secondLinks} uppercase />
        <ToTop />
      </div>
    </div>
  )
}

export default FooterLinks
