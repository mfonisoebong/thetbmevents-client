import Container from "@common/components/Container"
import PasswordForm from "@lib/reset-password/components/PasswordForm"
import RedirectWrapper from "@lib/reset-password/components/RedirectWrapper"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"

export default function ResetPassword() {
  return (
    <RedirectWrapper>
      <Head>
        <title>Reset password</title>
      </Head>
      <Container>
        <PasswordForm />
      </Container>
    </RedirectWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  }
}
