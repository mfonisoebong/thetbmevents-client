import Container from "@common/components/Container";
import NoContent from "@common/components/NoContent";
import Head from "next/head";

export default function DeviceNotAllowed() {
  return (
    <>
      <Head>
        <title>Device not allowed</title>
      </Head>

      <Container>
        <div className="min-h-[80vh] pt-20">
          <NoContent
            title="Device not allowed"
            image="/images/failed.png"
            button={{
              text: "Go to dashboard",
              link: "/organizer/dashboard",
            }}
          >
            <p className="text-center">
              The tickets scan feature is only allowed on mobile devices
            </p>
          </NoContent>
        </div>
      </Container>
    </>
  );
}
