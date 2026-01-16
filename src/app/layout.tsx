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

        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse duration-1000"></div>
            <div className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-pink-100/40 dark:bg-purple-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
            <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-[#FBBC05]/10 dark:bg-[#FBBC05]/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
        </div>
        </body>
        </html>
    );
}
