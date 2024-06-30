import { FC, PropsWithChildren, useState } from "react"
import { SidebarContext } from "./Context"

const SidebarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const toggleShowSidebar = () => {
    setShowSidebar((state) => !state)
  }

  const toggleShowNotifications = () => {
    setShowNotifications((state) => !state)
  }

  return (
    <SidebarContext.Provider
      value={{
        showSidebar,
        toggleShowSidebar,
        showNotifications,
        toggleShowNotifications,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider
