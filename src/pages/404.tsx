import ArrowLeft from "@common/components/Icons/ArrowLeft"
import RouteLoader from "@common/components/RouteLoader"
import Head from "next/head"
import Image from "next/image"
import ButtonLink from "@common/components/ButtonLink"

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - This page was not found</title>
      </Head>
      <section className="min-h-[100vh] flex flex-col justify-center">
        <div className="flex justify-center">
          <Image
            className="w-full md:w-10/12"
            src="/images/404.svg"
            alt="404"
            width={1200}
            height={700}
          />
        </div>
        <div>
          <ButtonLink className="mx-auto w-max" href={"/"} size="lg">
            <ArrowLeft color="white" />
            <span>Go Home</span>
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
