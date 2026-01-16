import Link from 'next/link';
import React from "react";

// todo: put explore events link when available
export default function NotFound() {
    return (
        <main
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6">
            <section className="w-full max-w-4xl mx-auto items-center">
                <div className="p-8 md:p-12 bg-white/80 dark:bg-slate-900/60 rounded-2xl backdrop-blur-sm border border-slate-200">
                    <div className="mb-6 mx-auto text-6xl text-brand-yellow font-bold flex justify-center items-center gap-2">
                        <span>4</span>
                        <div className="flex items-center justify-center gap-4 w-16 h-16 rounded-full bg-brand-yellow">
                            <svg height="2500" viewBox="13.848000000000003 0 283.6449999999999 305.4" width="2328"
                                 xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                                <g fill="none" fillRule="evenodd">
                                    <path
                                        d="M269.352 91.664h-42.436V80.04h70.577v-65.73h-14.294V0H168.4v14.309h-13.848v91.664H140.26v13.861h-20.994v14.309H98.271v14.308H83.977v13.862H58.069v-14.309H44.222v-13.861H29.928v-28.17h-16.08v86.746h13.847v14.308h14.293v13.862h13.848v14.308H70.13v13.862h13.847v56.34h30.375V289.3h-13.848V277.23h13.848v-13.862h14.294V249.06h11.613v14.308h14.294V305.4h30.375V289.3h-14.294v-54.104h14.294V220.89h13.847v-21.016h14.294v-49.186h11.614v13.862h16.527v-30.406h-28.14v-25.934h56.282z"
                                        fill="#666"/>
                                    <path d="M182.248 20.569h16.974V37.56h-16.974z" fill="#fff"/>
                                </g>
                            </svg>
                        </div>
                        <span>4</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-center">Lost in the crowd? <br/> This page doesn&apos;t exist</h1>
                    <p className="mt-4 text-base text-slate-600 dark:text-slate-300 text-center max-w-xl mx-auto">
                        It looks like the event you are looking for has already ended, moved, or never took the stage.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-black-1c text-white font-medium shadow">
                            Go back home
                        </Link>
                        <Link href="#" aria-disabled className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-slate-700 bg-black/5 dark:bg-white/5">
                            <span className="material-icons-outlined">search</span>
                            Explore Events
                        </Link>
                    </div>
                    <p className="mt-6 text-xs text-slate-400 text-center">If you typed the web address, check it for
                        errors and try again.</p>
                </div>
            </section>
            <div className="absolute bottom-10 left-10 hidden xl:block opacity-20 pointer-events-none">
                <img alt="Abstract minimalist map pattern" className="w-64 h-64 object-cover rounded-xl grayscale"
                     data-alt="A minimalist abstract map layout of a city" data-location="London"
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-nrbiCLJsXY5a9iSp9_PUFk_QUW1a98XnD2mfoGV7ZBC-Z8S88zmCSVIc9I5GgBPbINyGzL7Sg2zUZW-iYRdkIUAeGDTyMaUIB6p5FZS3cbeWBjk0QWz3R4C3UJ-xZgLi6tNnTuYw2zlkDyj5xGpWS1WiQhhV0QIxfPUQb50TYnuZNZfTkOV3pvUkNQYN6Qm8PT2w5r74aYVuo6EQZNuxs4BjzQ7m2L3088e33ybb2xZtGHx_nXdaWsoczbMDwkZ23gaJeqXptyo"/>
            </div>
        </main>
    );
}
