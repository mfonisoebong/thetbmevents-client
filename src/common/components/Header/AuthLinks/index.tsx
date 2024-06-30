import ButtonLink from "@common/components/ButtonLink";
import useAuth from "@common/hooks/useAuth";
import Link from "next/link";
import { FC } from "react";
import UserActions from "@common/components/Header/AuthLinks/UserActions";

const AuthLinks: FC = () => {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex space-x-2 items-center">
      {!user.data && (
        <>
          <Link
            href="/login"
            className="px-3 lg:px-6 text-white font-semibold text-sm lg:text-base"
          >
            Login
          </Link>
          <ButtonLink
            variant="altPrimary"
            className=" text-sm lg:text-base"
            href="/signup/organizer"
          >
            Sign Up
          </ButtonLink>
        </>
      )}
      <UserActions />
    </div>
  );
};

export default AuthLinks;
