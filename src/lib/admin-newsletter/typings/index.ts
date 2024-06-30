import { PaginationData } from "@common/typings"

export interface NewsletterSignup {
  email: string
  created_at: string
}

export interface NewsletterSignupData extends PaginationData {
  data: NewsletterSignup[]
}

export interface NewsletterPaginationProps {
  data: NewsletterSignupData
}

export interface TableRowProps extends NewsletterSignup {}
