import SignupForm from '../../../components/auth/SignupForm';
import Link from "next/link";

export const metadata = {
	title: 'Sign Up',
}

export default function SignupPage() {
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
						<h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create your account</h1>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
							Provide your business details to get started.
						</p>
					</header>

					<SignupForm />

					<footer className="mt-6 text-center text-sm text-slate-700 dark:text-slate-300">
						<p>
							Already have an account? <Link href="/login" className="text-sky-600 font-medium hover:underline">Sign in</Link>
						</p>
					</footer>
				</div>
			</div>
		</main>
	);
}
