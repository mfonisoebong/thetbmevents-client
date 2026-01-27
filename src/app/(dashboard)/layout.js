import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Providers from "../../components/layouts/providers";
import {getEndpoint} from "../../lib/utils";


  export default async function layout({ children }) {
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

  return (
    <Providers>
      {children}
    </Providers>
  )
}
