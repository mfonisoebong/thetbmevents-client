// Wrap PublicLayout with TicketProvider for checkout flow
import React from 'react'
import type {ReactNode} from 'react'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import { TicketProvider } from '../../contexts/TicketContext'

export default function PublicLayout({children}: { children: ReactNode }) {
    return (
        <TicketProvider>
            <NavBar/>
            {children}
            <Footer/>
        </TicketProvider>
    )
}
