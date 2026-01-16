"use client";

import React from 'react';
import useCountries, {CountryOption} from '../../hooks/useCountries';

// https://github.com/JedWatson/react-select/issues/5991
import dynamic from "next/dynamic";
const CreatableSelect = dynamic(() => import("react-select/creatable"), { ssr: false });

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
				<CreatableSelect
					inputId={id}
					isDisabled={loading}
					isSearchable={true}
					options={countries}
					value={value}
					onChange={(v: CountryOption) => onChangeAction(v)}
					formatOptionLabel={(country : CountryOption )=> (
						<div className="flex gap-2 items-center">
							<img src={'/images/flags/' + country.code?.toLowerCase() + '.svg'} alt="" className="w-7 h-5 inline-block"/>
							<span>{country.name}</span>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
