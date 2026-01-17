import type { Metadata } from 'next';
import type { ReactElement } from 'react'
import Explore from './Explore'

export const metadata: Metadata = {
    title: 'Explore Events',
    description: 'Discover events nearby or online — search and pick a category.',
}

export default function ExplorePage(): ReactElement {
  return <Explore />
}
