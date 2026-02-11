import React from 'react';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import Providers from "../../components/layouts/providers";
import {getEndpoint} from "@lib/utils";
import {AuthMeResponse} from "./settings/page";
import Suspended from "../../components/Suspended";


export default async function layout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies();

    let token;

    if (!(token = cookieStore.get('token'))) redirect('/login');

    const res = await fetch(getEndpoint('/auth/me'), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.value}`,
        },
    });

    if (res.status !== 200) {
        redirect('/login');
    }

    const user: AuthMeResponse = await res.json();

    if (user.account_state === 'suspended') return <Suspended/>;

    return (
        <Providers>
            {children}
        </Providers>
    )
}
