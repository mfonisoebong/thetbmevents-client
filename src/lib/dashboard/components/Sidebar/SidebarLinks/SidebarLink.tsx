import { SidebarLinkProps } from "@lib/dashboard/typings";
import Link from "next/link";
import { FC } from "react";
import styles from "../styles.module.css";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import useAuth from "@common/hooks/useAuth";

const SidebarLink: FC<SidebarLinkProps> = ({ href, text }) => {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const className = pathname === href ? styles.activelink : styles.link;
  const isPending =
    user.data?.role === "organizer" && user.data?.account_state === "pending";
  const c = twMerge(className, isPending ? styles.disabled : null);
  return (
    <Link title={text} className={c} href={href}>
      {text}
    </Link>
  );
};

export default SidebarLink;
