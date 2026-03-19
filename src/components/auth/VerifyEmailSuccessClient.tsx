"use client";

import { useEffect } from 'react';
import { setCookie } from '@lib/utils';
import TextLogo from '../TextLogo';

type VerifyEmailSuccessClientProps = {
	token: string;
	user: Record<string, any>;
	role: string;
};

export default function VerifyEmailSuccessClient({ token, user, role }: VerifyEmailSuccessClientProps) {
	useEffect(() => {
		setCookie('token', token);
		setCookie('user', JSON.stringify(user));
		setCookie('role', role);

		window.location.href = `/${role}/dashboard`;
	}, [role, token, user]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center light:bg-gradient-to-br light:from-slate-100 light:via-white light:to-sky-50 p-6">
			<TextLogo className="mb-6" />

			<div className="w-full max-w-md rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
				<div className="mx-auto mb-4 h-12 w-12 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
						<path d="M12 3v3m0 12v3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M3 12h3m12 0h3M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12" strokeLinecap="round" />
						<circle cx="12" cy="12" r="3.25" />
					</svg>
				</div>

				<h1 className="text-xl font-bold text-slate-900 dark:text-white">Email verified successfully</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Logging you in...</p>
			</div>
		</main>
	);
}
