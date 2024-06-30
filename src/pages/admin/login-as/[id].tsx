import Container from "@common/components/Container";
import ProtectedRoute from "@common/components/ProtectedRoute";
import MainSection from "@lib/admin-login-as/component/MainSection";
import RedirectWrapper from "@lib/admin-organizer/components/RedirectWrapper";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import { GetStaticPaths, GetStaticProps } from "next";

export default function LoginAs() {
  return (
    <ProtectedRoute>
      <RedirectUser page="admin" admin={"support"} />
      <RedirectWrapper>
        <Container className="h-[100vh] grid place-items-center">
          <MainSection />
        </Container>
      </RedirectWrapper>
    </ProtectedRoute>
  );
}
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
