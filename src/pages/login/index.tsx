import RouteLoader from "@common/components/RouteLoader";
import AuthLayout from "../../lib/auth-pages/components/AuthLayout";
import RedirectWrapper from "../../lib/auth-pages/components/RedirectWrapper";
import MainSection from "../../lib/login/components/MainSection";
import Head from "next/head";
import RecaptchaWrapper from "@lib/auth-pages/components/RecaptchaWrapper";
import SSOHead from "@common/components/SSOHead";

export default function LoginPage() {
  return (
    <>
      <SSOHead
        title={"TBM Events - Login"}
        description={"Welcome back"}
        og={{}}
      />
      <RedirectWrapper>
        <Head>
          <title>TBM Events - Login</title>
        </Head>
        <RecaptchaWrapper>
          <AuthLayout>
            <MainSection />
          </AuthLayout>
        </RecaptchaWrapper>
      </RedirectWrapper>
    </>
  );
}
