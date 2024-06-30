import MainSection from "@lib/add-new-staff/components/MainSection";
import AuthLayout from "@lib/auth-pages/components/AuthLayout";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import Head from "next/head";

export default function AddNewAdmin() {
  return (
    <>
      <RedirectUser page="admin" admin={"super_admin"} />
      <Head>
        <title>Add new staff</title>
      </Head>
      <AuthLayout>
        <MainSection />
      </AuthLayout>
    </>
  );
}
