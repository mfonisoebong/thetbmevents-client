import { FC, PropsWithChildren } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useRouter } from "next/router";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const disabledRoutes = [
    "/login",
    "/signup/organizer",
    "/organizer/dashboard",
    "/organizer/dashboard/events",
    "/organizer/dashboard/sales",
    "/organizer/dashboard/finance",
    "/organizer/dashboard/events/create",
    "/organizer/dashboard/events/edit/[id]",
    "/dashboard/tickets/[id]",
    "/dashboard/tickets",
    "/organizer/dashboard/verification/pending",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/dashboard/profile/edit",
    "/verify/otp",
    "/admin/overview",
    "/admin/users",
    "/admin/staffs",
    "/admin/features",
    "/admin/slider",
    "/admin/testimonies",
    "/admin/newsletters",
    "/admin/categories",

    "/admin/finances",
    "/admin/payment-method",
    "/admin/order-history",
    "/admin/staffs/[id]",
    "/admin/staffs/add-new",
    "/admin/event-organizers",
    "/admin/event-organizers/[id]",
    "/admin/login-as/[id]",
    "/auth/reset-password/[id]",
    "/events/scan",
  ];

  const disabledMainWrapper = ["/organizer/dashboard"];

  const router = useRouter();
  const isDisabledRoute = disabledRoutes.includes(router.pathname);
  const isDisabledMainRoute = disabledMainWrapper.includes(router.pathname);

  return (
    <>
      {!isDisabledRoute && <Header />}
      {!isDisabledMainRoute ? <main>{children}</main> : <>{children}</>}
      {!isDisabledRoute && <Footer />}
    </>
  );
};

export default Layout;
