"use client";

import React, { FormEvent, useState } from 'react';
import PhoneInput from './PhoneInput';
import { validateAll } from '../../hooks/useFormValidation';
import useCountries, { CountryOption } from '../../hooks/useCountries';
import {SelectOption} from "@lib/types";
import {Dropdown} from "../Dropdown";

export default function SignupForm() {
	// todo: use reducer
	const [businessName, setBusinessName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<SelectOption>({label: "Nigeria (+234)", value: "NG"});

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		const vals = { businessName, email, password, phone, country: selectedCountry.value.toString() };

		const errs = validateAll(vals);

		setErrors(errs as Record<string, string>);

		if (Object.keys(errs).length) return;

		setLoading(true);

		// placeholder: replace with API call
		await new Promise((res) => setTimeout(res, 700));

		setLoading(false);

		console.log('signup:', { businessName, email, password, phone, country: vals.country });
	}

	const { countries, loading: countriesLoading } = useCountries();

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Business name</label>
				<input
					value={businessName}
					onChange={(e) => setBusinessName(e.target.value)}
					className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
					placeholder="Your business name"
				/>
				{errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>}
			</div>

			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
					placeholder="you@example.com"
				/>
				{errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
						Country
					</label>
					<div className="mt-1">
						<Dropdown
							isDisabled={countriesLoading}
							data={countries}
							selected={selectedCountry}
							onChange={setSelectedCountry}
							customEl={(option) => (
								<div className="flex gap-2 items-center p-2 text-sm text-black-1c dark:text-white hover:bg-gray-300 dark:hover:bg-white/10 cursor-pointer" key={option.value} onClick={option.onClick}>
									<img src={'/images/flags/' + option.code?.toLowerCase() + '.svg'} alt="" className="w-7 h-5 inline-block"/>
									<span>{option.name}</span>
								</div>
							)}
						/>
					</div>
				</div>

				<PhoneInput id="phone" value={phone} onChangeAction={setPhone} />
			</div>
			{errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}

			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
				<div className="relative">
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type={showPassword ? 'text' : 'password'}
						className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
						placeholder="Choose a strong password"
					/>
					<button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800">
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
				{errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
			</div>

			<button type="submit" disabled={loading} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg disabled:opacity-60">
				{loading ? 'Creating account…' : 'Create account'}
			</button>
		</form>
	);
}
