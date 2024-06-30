import { FC } from "react";
import Head from "next/head";
import { DashboardHeadProps } from "@lib/dashboard/typings";

const DashboardHead: FC<DashboardHeadProps> = ({ title, children }) => {
  return (
    <Head>
      <title>{`TBM Events - Dashboard ${title ? title : ""}`}</title>
      {children}
      <style>
        {`
body::-webkit-scrollbar {
    display:none
}
`}
      </style>
    </Head>
  );
};

export default DashboardHead;
