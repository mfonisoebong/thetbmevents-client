"use client";

import { useEffect, useState, useMemo } from "react";

export type CountryOption = {
	value: string; // ISO code. needed by react-select
	label: string; // needed by react-select
	name: string;
	dial_code: string;
	code: string;
};

type RawCountry = {
	name: string;
	dial_code: string;
	code: string;
}

export default function useCountries() {
	const [raw, setRaw] = useState<RawCountry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const countries = useMemo<CountryOption[]>(() => {
		if (!raw) return [];

		return raw.map((c: RawCountry) => ({
			value: c.code,
			label: `${c.name} (${c.dial_code})`,
			name: c.name,
			dial_code: c.dial_code,
			code: c.code,
		}));
	}, [raw]);

	useEffect(() => {
		/*
			The `mounted` flag is used to avoid updating state after the component has unmounted. It prevents calling set<something> when an in-flight async `fetch` resolves after unmount, which otherwise can cause React warnings or memory-leak risks.

			Key points:
				- Set to `true` when effect runs, flipped to `false` in the cleanup.
				- Async code checks `mounted` before calling state setters.
				- Alternatives: use `AbortController` to cancel the fetch or use a `useRef` boolean for the flag.
		*/
		let mounted = true;

		async function load() {
			try {
				const res = await fetch('/data/countries.json');

				if (!res.ok) {
					const msg = `HTTP ${res.status}`;

					if (mounted) setError(msg);

					return;
				}

				const data = await res.json();

				if (!mounted) return;

				setRaw(Array.isArray(data) ? data : []);
			} catch (err: any) {
				console.error('Failed to load countries', err);

				if (!mounted) return;

				setError(err?.message ?? String(err));
			} finally {
				if (mounted) setLoading(false);
			}
		}

		load();

		return () => {
			mounted = false;
		};
	}, []);

	return { countries, loading, error };
}
