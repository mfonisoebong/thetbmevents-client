import React from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();

    if (cookieStore.get('role')?.value !== "admin") return redirect('/');

    return children
}
