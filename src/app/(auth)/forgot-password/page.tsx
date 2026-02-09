"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import TextLogo from "../../../components/TextLogo";
import HTTP from "@lib/HTTP";
import { getEndpoint, getErrorMessage } from "@lib/utils";
import { errorToast, successToast } from "../../../components/Toast";

type Step = "request" | "reset";

type Errors = {
	email?: string;
	otp?: string;
	password?: string;
	password_confirmation?: string;
};

function isValidEmail(value: string) {
	const v = value.trim();
	if (!v) return false;
	// Basic sanity regex; server will still validate.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ForgotPasswordPage() {
	const [step, setStep] = useState<Step>("request");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [errors, setErrors] = useState<Errors>({});

	const title = useMemo(() => {
		return step === "request" ? "Forgot your password?" : "Reset your password";
	}, [step]);

	const subtitle = useMemo(() => {
		return step === "request"
			? "Enter your email and we’ll send you a verification code."
			: "Enter the code we sent to your email and choose a new password.";
	}, [step]);

	function setFieldError<K extends keyof Errors>(key: K, value?: Errors[K]) {
		setErrors((prev) => {
			if (prev[key] === value) return prev;
			return { ...prev, [key]: value };
		});
	}

	function validateRequest(): boolean {
		const next: Errors = {};
		if (!email.trim()) next.email = "Email address is required";
		else if (!isValidEmail(email)) next.email = "Enter a valid email address";

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	function validateReset(): boolean {
		const next: Errors = {};
		if (!otp.trim()) next.otp = "Verification code is required";
		if (!password) next.password = "Password is required";
		else if (password.length < 8) next.password = "Password must be at least 8 characters";
		if (!passwordConfirmation) next.password_confirmation = "Please confirm your password";
		else if (passwordConfirmation !== password)
			next.password_confirmation = "Passwords do not match";

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function onRequestCode(e: FormEvent) {
		e.preventDefault();
		if (!validateRequest()) return;

		setLoading(true);
		const resp = await HTTP<any, any>({
			url: getEndpoint("/auth/forgot-password"),
			data: { email: email.trim() },
		});

		if (resp.ok) {
			successToast("Code sent. Check your email.");
			setStep("reset");
		} else {
			errorToast(getErrorMessage(resp.error));
		}
		setLoading(false);
	}

	async function onResetPassword(e: FormEvent) {
		e.preventDefault();
		if (!validateReset()) return;

		setLoading(true);
		const resp = await HTTP<any, any>({
			url: getEndpoint("/auth/forgot-password/reset"),
			data: {
				otp: otp.trim(),
				password,
				password_confirmation: passwordConfirmation,
			},
		});

		if (resp.ok) {
			successToast("Password reset successfully. Please sign in.");
			window.location.href = "/login";
		} else {
			errorToast(getErrorMessage(resp.error));
		}
		setLoading(false);
	}

	return (
		<main className="min-h-screen flex flex-col items-center justify-center light:bg-gradient-to-br light:from-slate-100 light:via-white light:to-sky-50 p-6">
			<TextLogo />

			<div className="w-full max-w-md relative">
				{/* organic blob glass shape behind the card */}
				<div className="absolute -left-12 -top-10 w-80 h-80 z-0 pointer-events-none">
					<svg
						viewBox="0 0 200 200"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full filter blur-2xl opacity-80"
					>
						<defs>
							<linearGradient id="gBlob" x1="0" x2="1">
								<stop offset="0%" stopColor="#FBBC05" stopOpacity="0.6" />
								<stop offset="100%" stopColor="#FBBC05" stopOpacity="0.45" />
							</linearGradient>
						</defs>
						<path
							fill="url(#gBlob)"
							d="M44.6,-63.2C58.3,-52.8,69.6,-38.3,73.1,-22.9C76.6,-7.4,72.3,9,63.5,22.6C54.7,36.1,41.4,46.9,26,55.8C10.6,64.7,-6.9,71.7,-22.6,67.7C-38.3,63.7,-52.1,48.7,-61.4,31.9C-70.6,15,-75.3,-4.6,-69.7,-22.4C-64.2,-40.2,-48.4,-56.2,-30.1,-65.6C-11.8,-75.1,8.7,-78,26.9,-73.3C45.1,-68.6,44.6,-63.2,44.6,-63.2Z"
							transform="translate(100 100)"
						/>
					</svg>
				</div>

				<div className="relative z-10 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
					<div className="absolute inset-0 pointer-events-none rounded-2xl shadow-inner" />

					<header className="mb-8 text-center">
						<h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
					</header>

					{step === "request" ? (
						<form onSubmit={onRequestCode} className="space-y-8">
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
									Email address
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										if (errors.email) setFieldError("email", undefined);
									}}
									className={
										"mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm " +
										(errors.email ? "ring-2 ring-red-500" : "")
									}
									placeholder="you@example.com"
									required
								/>
								{errors.email ? <p className="mt-1 text-sm text-red-500">{errors.email}</p> : null}
							</div>

							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg disabled:opacity-60"
							>
								{loading ? "Sending…" : "Send code"}
							</button>
						</form>
					) : (
						<form onSubmit={onResetPassword} className="space-y-6">
							<div>
								<label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
									Verification code
								</label>
								<input
									id="otp"
									type="text"
									value={otp}
									onChange={(e) => {
										setOtp(e.target.value);
										if (errors.otp) setFieldError("otp", undefined);
									}}
									className={
										"mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm " +
										(errors.otp ? "ring-2 ring-red-500" : "")
									}
									placeholder="123456"
									required
								/>
								{errors.otp ? <p className="mt-1 text-sm text-red-500">{errors.otp}</p> : null}
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
									New password
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (errors.password) setFieldError("password", undefined);
										}}
										className={
											"mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm " +
											(errors.password ? "ring-2 ring-red-500" : "")
										}
										placeholder="Your new password"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword((s) => !s)}
										aria-label={showPassword ? "Hide password" : "Show password"}
										className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800"
									>
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
								{errors.password ? <p className="mt-1 text-sm text-red-500">{errors.password}</p> : null}
							</div>

							<div>
								<label
									htmlFor="password_confirmation"
									className="block text-sm font-medium text-slate-700 dark:text-slate-200"
								>
									Confirm new password
								</label>
								<div className="relative">
									<input
										id="password_confirmation"
										type={showConfirm ? "text" : "password"}
										value={passwordConfirmation}
										onChange={(e) => {
											setPasswordConfirmation(e.target.value);
											if (errors.password_confirmation) setFieldError("password_confirmation", undefined);
										}}
										className={
											"mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 focus:ring-offset-0 shadow-sm " +
											(errors.password_confirmation ? "ring-2 ring-red-500" : "")
										}
										placeholder="Confirm your new password"
										required
									/>
									<button
										type="button"
										onClick={() => setShowConfirm((s) => !s)}
										aria-label={showConfirm ? "Hide password" : "Show password"}
										className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800"
									>
										{showConfirm ? (
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
								{errors.password_confirmation ? (
									<p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
								) : null}
							</div>

							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg disabled:opacity-60"
							>
								{loading ? "Resetting…" : "Reset password"}
							</button>
						</form>
					)}

					<footer className="mt-6 text-center text-sm text-slate-700 dark:text-slate-300">
						<p>
							Remembered your password?{" "}
							<Link href="/login" className="text-sky-600 font-medium hover:underline">
								Sign in
							</Link>
						</p>
					</footer>
				</div>
			</div>
		</main>
	);
}

