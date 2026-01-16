"use client";

import Link from 'next/link';
import {FormEvent, useState} from 'react';

export default function LoginPage() {
	// todo: use reducer
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		setLoading(true);

		// placeholder: replace with real auth call
		await new Promise((res) => setTimeout(res, 700));
		setLoading(false);

		// For now just log the values
		console.log({ email, password, remember });
		// TODO: redirect after successful login
	}

	return (
		<main className="min-h-screen flex items-center justify-center light:bg-gradient-to-br light:from-slate-100 light:via-white light:to-sky-50 p-6">
			<div className="w-full max-w-md relative">
				{/* organic blob glass shape behind the card */}
				<div className="absolute -left-12 -top-10 w-80 h-80 z-0 pointer-events-none">
					<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-2xl opacity-80">
						<defs>
							<linearGradient id="gBlob" x1="0" x2="1">
								<stop offset="0%" stopColor="#FBBC05" stopOpacity="0.6" />
								<stop offset="100%" stopColor="#FBBC05" stopOpacity="0.45" />
							</linearGradient>
						</defs>
						<path fill="url(#gBlob)" d="M44.6,-63.2C58.3,-52.8,69.6,-38.3,73.1,-22.9C76.6,-7.4,72.3,9,63.5,22.6C54.7,36.1,41.4,46.9,26,55.8C10.6,64.7,-6.9,71.7,-22.6,67.7C-38.3,63.7,-52.1,48.7,-61.4,31.9C-70.6,15,-75.3,-4.6,-69.7,-22.4C-64.2,-40.2,-48.4,-56.2,-30.1,-65.6C-11.8,-75.1,8.7,-78,26.9,-73.3C45.1,-68.6,44.6,-63.2,44.6,-63.2Z" transform="translate(100 100)" />
					</svg>
				</div>

				<div className="relative z-10 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
					{/* soft vignette for extra depth */}
					<div className="absolute inset-0 pointer-events-none rounded-2xl shadow-inner" />

					<header className="mb-8 text-center">
						<h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign in to your account</h1>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							Enter your credentials to access your dashboard.
						</p>
					</header>

					<form onSubmit={onSubmit} className="space-y-8">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
								Email address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm"
								placeholder="you@example.com"
								aria-required
								required
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
								Password
							</label>
							<div className="relative">
								{/*TODO: password rules*/}
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm"
									placeholder="Your password"
									aria-required
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword((s) => !s)}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800">
									{showPassword ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										  <path d="M2.5 12s3.5-7.5 9.5-7.5S21.5 12 21.5 12s-3.5 7.5-9.5 7.5S2.5 12 2.5 12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										  <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										  <path d="M2 21 L23 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path d="M2.5 12s3.5-7.5 9.5-7.5S21.5 12 21.5 12s-3.5 7.5-9.5 7.5S2.5 12 2.5 12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											<circle cx="12" cy="12" r="2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between mt-1">
							<label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
								<input
									type="checkbox"
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300"
								/>
								<span>Remember me</span>
							</label>

							<Link href="#" className="text-sm text-sky-600 hover:underline">Forgot password?</Link>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg disabled:opacity-60">
							{loading ? 'Signing in…' : 'Sign in'}
						</button>
					</form>

					<footer className="mt-6 text-center text-sm text-slate-700 dark:text-slate-300">
						<p>
							Don&apos;t have an account?{' '}
							<Link href="/signup" className="text-sky-600 font-medium hover:underline">
								Sign up
							</Link>
						</p>
					</footer>
				</div>
			</div>
		</main>
	);
}
