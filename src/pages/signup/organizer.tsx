import AuthLayout from "@lib/auth-pages/components/AuthLayout";
import RedirectWrapper from "@lib/auth-pages/components/RedirectWrapper";
import MainSection from "@lib/signup-main/components/MainSection";
import RecaptchaWrapper from "@lib/auth-pages/components/RecaptchaWrapper";
import SSOHead from "@common/components/SSOHead";

export default function SignUpWithAccountType() {
  return (
    <>
      <SSOHead
        title="TBM Events - Signup as an organizer"
        description="Signup as an organizer"
        og={{}}
      />
      <RedirectWrapper>
        <RecaptchaWrapper>
          <AuthLayout>
            <MainSection />
          </AuthLayout>
        </RecaptchaWrapper>
      </RedirectWrapper>
    </>
  );
}
