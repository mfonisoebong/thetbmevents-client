"use client";

import React from 'react';
import { CountryOption } from '../../hooks/useCountries';

type Props = {
	country?: CountryOption | null;
	value?: string;
	onChangeAction: (v: string) => void;
	id?: string;
	placeholder?: string;
	className?: string;
};

export default function PhoneInput({ country, value, onChangeAction, id, placeholder, className }: Props) {
	return (
		<div className={className}>
			<label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone number</label>
			<div className="mt-1 flex rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
				<span className="px-3 py-2 bg-gray-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center">{country?.dial_code ?? '+'}</span>
				<input
					id={id}
					type="tel"
					value={value}
					onChange={(e) => onChangeAction(e.target.value)}
					className="w-full px-3 py-2 bg-white/60 dark:bg-transparent focus:outline-none"
					placeholder={placeholder || 'Phone number'}
				/>
			</div>
		</div>
	);
}
