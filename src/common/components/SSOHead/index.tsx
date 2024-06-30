import { FC } from "react";
import Head from "next/head";
import { SSOHeadProps } from "@common/typings";

const SSOHead: FC<SSOHeadProps> = (props) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name={"description"} content={props.description} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={props.og?.image ?? "/images/tbm_logo_sm.png"}
      />
      <meta property={"og:title"} content={props.og?.title ?? props.title} />
      <meta
        property={"og:description"}
        content={props.og?.description ?? props.description}
      />
      <meta property="og:site_name" content="TBM Events" />
    </Head>
  );
};

export default SSOHead;
