"use client";

import React from 'react';
import Select from 'react-select';
import useCountries, {CountryOption} from '../../hooks/useCountries';

type Props = {
	value?: CountryOption | null;
	onChangeAction: (val: CountryOption | null) => void;
	id?: string;
	className?: string;
};

export default function CountrySelect({ value, onChangeAction, id, className }: Props) {
	const { countries, loading } = useCountries();

	return (
		<div className={className}>
			<label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
				Country
			</label>
			<div className="mt-1">
				<Select
					inputId={id}
					isDisabled={loading}
					options={countries as any}
					value={value as any}
					onChange={(v: any) => onChangeAction(v as CountryOption | null)}
					placeholder={loading ? 'Loading countries...' : 'Select country'}
					styles={{
						control: (base: any) => ({ ...base, background: 'transparent', borderRadius: 8 }),
						menu: (base: any) => ({ ...base, zIndex: 9999 }),
					}}
				/>
			</div>
		</div>
	);
}
