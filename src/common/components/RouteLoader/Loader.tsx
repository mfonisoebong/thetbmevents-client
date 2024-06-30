import { FC } from "react"
import styles from "./styles.module.css"
import Image from "next/image"
import { Device } from "@common/typings"
import useMediaQuery from "@common/hooks/useMediaQuery"

const Loader: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium)
  const imageSize = isMediumDevice ? 100 : 80

  return (
    <div className={styles.loading}>
      <Image
        src="/images/tbm_logo_sm.png"
        width={imageSize}
        height={imageSize}
        alt="TBM logo"
      />
    </div>
  )
}

export default Loader
