"use client";

import { useEffect } from 'react';
import { setCookie } from '@lib/utils';

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
		<main className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl shadow-2xl p-8 text-center">
				<h1 className="text-xl font-bold text-slate-900 dark:text-white">Email verified successfully</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Logging you in...</p>
			</div>
		</main>
	);
}

