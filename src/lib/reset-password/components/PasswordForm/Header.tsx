import Image from "next/image"
import { FC } from "react"

const Header: FC = () => {
  return (
    <div>
      <Image
        src="/images/tbm_logo_sm.png"
        alt="TBM logo"
        width={200}
        height={200}
        className="w-20 h-16 mx-auto"
      />
      <h2 className="text-xl md:text-2xl text-center font-bold">
        Reset password
      </h2>
    </div>
  )
}

export default Header
