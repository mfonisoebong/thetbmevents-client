import Link from 'next/link';
import type { Metadata } from 'next';
import VerifyEmailSuccessClient from '@components/auth/VerifyEmailSuccessClient';
import { getEndpoint } from '@lib/utils';

export const metadata: Metadata = {
	title: 'Verify Email',
};

type PageProps = {
	params: Promise<{ hash: string }>;
};

type VerifySuccessPayload = {
	message?: string;
	data?: {
		token?: string;
		user?: Record<string, any> & { role?: string };
	};
	token?: string;
	user?: Record<string, any> & { role?: string };
};

export default async function VerifyEmailPage({ params }: PageProps) {
	const { hash } = await params;
	const normalizedHash = (hash ?? '').trim();

	if (!normalizedHash) {
		return (
			<VerifyEmailFeedback
				title="Invalid verification link"
				message="This verification link is invalid. Please request a new link from the signup page."
			/>
		);
	}

	const response = await fetch(getEndpoint(`/auth/verify-email-link/${encodeURIComponent(normalizedHash)}`), {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		cache: 'no-store',
	});

	let payload: VerifySuccessPayload | null;

	try {
		payload = (await response.json()) as VerifySuccessPayload;
	} catch {
		payload = null;
	}

	if (response.status === 200) {
		const token = payload?.data?.token ?? payload?.token;
		const user = payload?.data?.user ?? payload?.user;
		const role = user?.role;

		if (token && user && role) {
			return <VerifyEmailSuccessClient token={token} user={user} role={role} />;
		}

		return (
			<VerifyEmailFeedback
				title="Verification completed"
				message="Your email was verified, but we could not complete sign in automatically. Please sign in manually."
			/>
		);
	}

	if (response.status === 400) {
		return (
			<VerifyEmailFeedback
				title="Verification failed"
				message={payload?.message || 'This verification link is invalid or expired.'}
			/>
		);
	}

	return (
		<VerifyEmailFeedback
			title="Something went wrong"
			message={payload?.message || 'We could not verify your email right now. Please try again later.'}
		/>
	);
}

function VerifyEmailFeedback({ title, message }: { title: string; message: string }) {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center light:bg-gradient-to-br light:from-slate-100 light:via-white light:to-sky-50 p-6">
			<div className="w-full max-w-md rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl shadow-2xl p-8 sm:p-10 text-center space-y-6">
				<div className="space-y-2">
					<h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
					<p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
				</div>

				<div className="flex items-center justify-center gap-4 text-sm">
					<Link href="/signup" className="text-sky-600 font-medium hover:underline">
						Go to signup
					</Link>
					<Link href="/login" className="text-sky-600 font-medium hover:underline">
						Go to login
					</Link>
				</div>
			</div>
		</main>
	);
}
