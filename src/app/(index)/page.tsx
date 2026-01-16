import type {Metadata} from 'next'
import Index from './Index'

export const metadata: Metadata = {
    title: 'Home',
}

export default function Page() {
    return <Index/>
}
