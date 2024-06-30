import NoContent from "@common/components/NoContent";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import ProtectedRoute from "@common/components/ProtectedRoute";

export default function VerificationPending() {
  return (
    <ProtectedRoute>
      <DashboardHead title="Verification pending" />
      <Header />
      <MainSection>
        <section className="min-h-[80vh]">
          <NoContent
            image="/images/not-found.svg"
            title="Pending verification"
            button={{
              text: "Go to home",
              link: "/",
            }}
          >
            <div className="mx-auto w-10/12 md:w-8/12 lg:w-5/12 text-center text-sm md:text-base">
              You account is awaiting verification from our admin. You&apos;ll
              be able to login to your dashboard once the admin has verified
              your email
            </div>
          </NoContent>
        </section>
      </MainSection>
    </ProtectedRoute>
  );
}
