import { PaginationData, UserAccountState, UserRole } from "@common/typings"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone: string
  created_at: string
  role: UserRole
  account_status: UserAccountState
}

export interface UsersData extends PaginationData {
  data: User[]
}

export interface UsersPaginationProps {
  data: UsersData
}

export interface TableRowProps extends User {}

export type TableRowSmProps = Pick<
  TableRowProps,
  "id" | "name" | "email" | "role"
>

export type SortFilter = "Name" | "Email address"

export interface SelectedUsersContextValues {
  selectedUserIds: string[]
  toggleSelected: (id: string) => void
  selectIds: (ids: string[]) => void
}

export interface MenuItemsProps {
  id: string
  status?: UserAccountState
}

export interface UserHeaderProps {
  role: UserRole
}
