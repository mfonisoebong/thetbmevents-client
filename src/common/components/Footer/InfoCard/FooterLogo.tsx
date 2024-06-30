import Image from "next/image"
import { FC } from "react"
import styles from "../styles.module.css"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"

const FooterLogo: FC = () => {
  const logoSize = useMediaQuery(Device.medium) ? 180 : 140

  return (
    <div className={styles.logo}>
      <Image
        src="/images/tbm_logo.png"
        alt="TBM logo"
        width={logoSize}
        height={40}
        priority
      />
    </div>
  )
}

export default FooterLogo
