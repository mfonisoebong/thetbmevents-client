import { FC } from "react"
import NavLinks from "./NavLinks"
import UserLinks from "./UserLinks"

const NavControls: FC = () => {
  return (
    <div className="ml-auto w-9/12 md:w-5/12 lg:w-4/12 flex items-center justify-end space-x-1 md:space-x-5">
      <NavLinks />
      <UserLinks />
    </div>
  )
}

export default NavControls
