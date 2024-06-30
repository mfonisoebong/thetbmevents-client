import Head from "next/head";
import ProtectedRoute from "@common/components/ProtectedRoute";
import Container from "@common/components/Container";
import Header from "../../lib/verify-otp/components/Header";
import VerificationForm from "../../lib/verify-otp/components/VerificationForm";
import Favicon from "@common/components/SSOHead/Favicon";

export default function VerifyOtp() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Verify OTP</title>
        <Favicon />
      </Head>

      <Container className="py-20">
        <div className="w-full md:w-7/12 lg:w-6/12 mx-auto p-2 space-y-8">
          <Header />
          <VerificationForm />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
