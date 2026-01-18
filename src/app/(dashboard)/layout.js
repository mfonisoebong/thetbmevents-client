import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Providers from "../../components/layouts/providers";


export default function layout({children}) {
  // todo: uncomment when backend auth is ready
  // if (!cookies().get('token')) redirect('/')

  return (
    <Providers>
      {children}
    </Providers>
  )
}
