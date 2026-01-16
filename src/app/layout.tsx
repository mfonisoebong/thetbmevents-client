import type {Metadata} from 'next'
import "./global.css";

import type {ReactNode} from "react";
import NextTopLoader from "nextjs-toploader";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
    title: {
        default: "TBM Events",
        template: "%s - TBM Events",
    },
};

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark antialiased transition-colors duration-300 min-h-screen relative">
        <NextTopLoader color="#E8B025"/>
        {children}
        <Toaster/>
        </body>
        </html>
    );
}
