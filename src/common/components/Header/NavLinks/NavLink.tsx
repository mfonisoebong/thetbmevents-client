import { NavLinkProps } from "@common/typings"
import Link from "next/link"
import { FC } from "react"
import styles from "../styles.module.css"
import { useRouter } from "next/router"

const NavLink: FC<NavLinkProps> = (props) => {
  const { pathname } = useRouter()

  const className =
    pathname === props.href ? styles.navlinkactive : styles.navlink

  return <Link className={className} {...props} />
}

export default NavLink
