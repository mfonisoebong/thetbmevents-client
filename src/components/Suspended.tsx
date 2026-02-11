"use client";

import Link from "next/link";
import TextLogo from "@components/TextLogo";
import {logout} from "@components/layouts/SidebarLayout";

function SupportMailto() {
	const subject = encodeURIComponent("Account suspended – TBM Events");
	const body = encodeURIComponent(
		"Hi Support,\n\nMy account appears to be suspended. Please help me review and restore access.\n\nThanks."
	);
	return `mailto:admin@thetbmevents.com?subject=${subject}&body=${body}`;
}

export default function Suspended() {

	return (
		<main className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center px-6 py-10">
			<div className="w-full max-w-xl relative">
				{/* soft accent blob behind card, consistent with auth screens */}
				<div className="absolute -left-10 -top-10 w-80 h-80 z-0 pointer-events-none">
					<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-2xl opacity-60">
						<defs>
							<linearGradient id="gSusp" x1="0" x2="1">
								<stop offset="0%" stopColor="#FBBC05" stopOpacity="0.35" />
								<stop offset="100%" stopColor="#0284C7" stopOpacity="0.25" />
							</linearGradient>
						</defs>
						<path fill="url(#gSusp)" d="M37.4,-61.6C49.6,-57.4,61.4,-50,66.5,-39.6C71.7,-29.2,70.2,-15.8,67.3,-3.9C64.4,8,60.1,18.5,54.1,28.4C48.1,38.3,40.4,47.6,30.6,54.8C20.7,61.9,8.7,66.9,-2.9,71.2C-14.5,75.6,-29.1,79.2,-40.4,73.3C-51.7,67.4,-59.7,52.1,-65.2,36.9C-70.7,21.7,-73.6,6.7,-70.2,-6.8C-66.8,-20.3,-57.2,-32.3,-46.4,-38.7C-35.6,-45.1,-23.7,-45.9,-12.3,-53.4C-0.8,-60.9,10.1,-75.1,20.6,-74.9C31,-74.7,37.4,-61.6,37.4,-61.6Z" transform="translate(100 100)" />
					</svg>
				</div>

				<div className="relative z-10 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl shadow-2xl border border-slate-200/60 dark:border-slate-700/50 p-8 sm:p-10">
					<div className="flex flex-col items-center text-center">
						<TextLogo />

						<div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-500/10 ring-1 ring-yellow-200 dark:ring-yellow-400/20">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-yellow-700 dark:text-yellow-300">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
							</svg>
						</div>

						<h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Account suspended</h1>
						<p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
							Your access is temporarily restricted. This can happen if your account needs verification or if there’s been a policy violation.
						</p>

						<div className="mt-6 w-full rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 p-4 text-left">
							<p className="text-sm font-semibold text-slate-900 dark:text-white">What you can do</p>
							<ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
								<li className="flex gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
									<span>Log out and sign back in after contacting support.</span>
								</li>
								<li className="flex gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
									<span>
										Reach support with your account email and a short description.
									</span>
								</li>
							</ul>
						</div>

						<div className="mt-7 flex w-full flex-col sm:flex-row gap-3">
							<button
								onClick={logout}
								className="w-full inline-flex items-center justify-center rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
							>
								Log out
							</button>
							<Link
								href={SupportMailto()}
								className="w-full inline-flex items-center justify-center rounded-lg bg-white/60 dark:bg-slate-900/50 text-slate-900 dark:text-white px-4 py-2 font-medium shadow-sm border border-slate-200/70 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
							>
								Contact support
							</Link>
						</div>

						<p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
							If you believe this is a mistake, contact support and we’ll help you sort it out.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

