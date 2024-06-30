import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useCallback, useEffect } from "react";
import NoContent from "@common/components/NoContent";
import Container from "@common/components/Container";
import RedirectIfAuthenticated from "@common/components/RedirectIfAuthenticated";
import useAuth from "@common/hooks/useAuth";

export default function AuthenticationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const token = router.query.token as string;

  const setToken = useCallback(async () => {
    if (!token) return;

    Cookies.set("access_token_enocded", token);
    await user.refetch();
  }, [token, user]);

  useEffect(() => {
    setToken();
  }, [setToken]);

  return (
    <RedirectIfAuthenticated>
      <Head>
        <title>Authentication</title>
      </Head>
      <section className="min-h-[80vh]">
        <Container>
          <NoContent title={"Authenticating"}>
            <div className={"text-center"}>
              <p className={"text-sm md:text-base text-gray-500 font-medium"}>
                You will be redirected to the TBM website in a bit
              </p>
            </div>
          </NoContent>
        </Container>
      </section>
    </RedirectIfAuthenticated>
  );
}
