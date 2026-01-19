import React from 'react'
import type {ReactNode} from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'

export default function PublicLayout({children}: { children: ReactNode }) {
    return (
        <>
            <NavBar/>
            {children}
            <Footer/>
        </>
    )
}
