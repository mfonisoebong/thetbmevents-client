import IconButton from "@common/components/IconButton"
import Gear from "@common/components/Icons/Gear"
import Link from "next/link"
import { FC } from "react"
import styles from "../styles.module.css"
import DoorOut from "@common/components/Icons/DoorOut"
import { useMutation } from "@tanstack/react-query"
import useAuth from "@common/hooks/useAuth"
import Loader from "@common/components/Icons/Loader"

const AuthLinks: FC = () => {
  const { logout } = useAuth()

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
  })

  const logoutAction = () => {
    mutate()
  }

  return (
    <div className="pl-8 mt-6 h-[20%]">
      <ul className="space-y-4">
        <Link className={styles.authlink} href="/dashboard/profile">
          <Gear color="black" />
          <span>Setting</span>
        </Link>
        <IconButton
          onClick={logoutAction}
          disabled={isLoading}
          icon={
            isLoading ? <Loader color="black" /> : <DoorOut color="black" />
          }
          className={styles.authlink}
        >
          <span>Logout</span>
        </IconButton>
      </ul>
    </div>
  )
}

export default AuthLinks
