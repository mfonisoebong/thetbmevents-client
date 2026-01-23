"use client";

import React, { FormEvent, useReducer } from 'react';
import PhoneInput from './PhoneInput';
import { FormErrors, validateAll } from '../../hooks/useFormValidation';
import useCountries from '../../hooks/useCountries';
import { SelectOption } from "@lib/types";
import { Dropdown } from "../Dropdown";

type SignupFormState = {
	values: {
		businessName: string;
		email: string;
		password: string;
		phone: string;
	};
	selectedCountry: SelectOption;
	errors: FormErrors;
	ui: {
		loading: boolean;
		showPassword: boolean;
	};
};

type SignupFormAction =
	| { type: 'SET_FIELD'; field: keyof SignupFormState['values']; value: string }
	| { type: 'SET_COUNTRY'; value: SelectOption }
	| { type: 'SET_ERRORS'; value: FormErrors }
	| { type: 'SET_LOADING'; value: boolean }
	| { type: 'TOGGLE_SHOW_PASSWORD' };

function getInitialState(): SignupFormState {
	return {
		values: {
			businessName: '',
			email: '',
			password: '',
			phone: '',
		},
		selectedCountry: { label: "Nigeria (+234)", value: "NG" },
		errors: {},
		ui: {
			loading: false,
			showPassword: false,
		},
	};
}

function reducer(state: SignupFormState, action: SignupFormAction): SignupFormState {
	switch (action.type) {
		case 'SET_FIELD': {
			// Clear just the touched field's error to avoid stale messages.
			const nextErrors = state.errors?.[action.field]
				? { ...state.errors, [action.field]: undefined }
				: state.errors;

			return {
				...state,
				values: { ...state.values, [action.field]: action.value },
				errors: nextErrors,
			};
		}
		case 'SET_COUNTRY':
			return { ...state, selectedCountry: action.value };
		case 'SET_ERRORS':
			return { ...state, errors: action.value };
		case 'SET_LOADING':
			return { ...state, ui: { ...state.ui, loading: action.value } };
		case 'TOGGLE_SHOW_PASSWORD':
			return { ...state, ui: { ...state.ui, showPassword: !state.ui.showPassword } };
		default:
			return state;
	}
}

export default function SignupForm() {
	const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		const vals = {
			...state.values,
			country: state.selectedCountry.value.toString(),
		};

		const errs = validateAll(vals);
		dispatch({ type: 'SET_ERRORS', value: errs });

		if (Object.keys(errs).length) return;

		dispatch({ type: 'SET_LOADING', value: true });

		// placeholder: replace with API call
		await new Promise((res) => setTimeout(res, 700));

		dispatch({ type: 'SET_LOADING', value: false });

		console.log('signup:', { ...state.values, country: vals.country });
	}

	const { countries, loading: countriesLoading } = useCountries();

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Business name</label>
				<input
					value={state.values.businessName}
					onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'businessName', value: e.target.value })}
					className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
					placeholder="Your business name"
				/>
				{state.errors.businessName && <p className="text-sm text-red-600 mt-1">{state.errors.businessName}</p>}
			</div>

			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
				<input
					value={state.values.email}
					onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
					type="email"
					className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
					placeholder="you@example.com"
				/>
				{state.errors.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Country</label>
					<div className="mt-1">
						<Dropdown
							isDisabled={countriesLoading}
							data={countries}
							selected={state.selectedCountry}
							onChange={(opt) => dispatch({ type: 'SET_COUNTRY', value: opt })}
							customEl={(option) => (
								<div
									className="flex gap-2 items-center p-2 text-sm text-black-1c dark:text-white hover:bg-gray-300 dark:hover:bg-white/10 cursor-pointer"
									key={option.value}
									onClick={option.onClick}
								>
									<img src={'/images/flags/' + option.code?.toLowerCase() + '.svg'} alt="" className="w-7 h-5 inline-block" />
									<span>{option.name}</span>
								</div>
							)}
						/>
					</div>
				</div>

				<PhoneInput id="phone" value={state.values.phone} onChangeAction={(v) => dispatch({ type: 'SET_FIELD', field: 'phone', value: v })} />
			</div>
			{state.errors.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}

			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
				<div className="relative">
					<input
						value={state.values.password}
						onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
						type={state.ui.showPassword ? 'text' : 'password'}
						className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm"
						placeholder="Choose a strong password"
					/>
					<button
						type="button"
						onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
						aria-label={state.ui.showPassword ? 'Hide password' : 'Show password'}
						className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800"
					>
						{state.ui.showPassword ? (
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
				{state.errors.password && <p className="text-sm text-red-600 mt-1">{state.errors.password}</p>}
			</div>

			<button
				type="submit"
				disabled={state.ui.loading}
				className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow hover:bg-yellow-600 text-white px-4 py-2 font-medium shadow-lg disabled:opacity-60"
			>
				{state.ui.loading ? 'Creating account…' : 'Create account'}
			</button>
		</form>
	);
}
