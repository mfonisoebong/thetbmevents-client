import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Providers from "../../components/layouts/providers";


  export default async function layout({ children }) {
    const cookieStore = await cookies();
    if (!cookieStore.get('token')) redirect('/');

  return (
    <Providers>
      {children}
    </Providers>
  )
}
