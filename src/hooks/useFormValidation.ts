"use client";

export type FormValues = {
	businessName?: string;
	email?: string;
	password?: string;
	phone?: string;
	country?: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function validateEmail(email?: string) {
	if (!email) return 'Email is required';
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
	return re.test(email) ? '' : 'Enter a valid email address';
}

export function validatePassword(password?: string) {
	if (!password) return 'Password is required';
	if ((password || '').length < 8) return 'Password must be at least 8 characters';
	return '';
}

export function validateBusinessName(name?: string) {
	if (!name) return 'Business name is required';
	if ((name || '').length < 2) return 'Business name is too short';
	return '';
}

export function validatePhone(phone?: string) {
	if (!phone) return 'Phone number is required';
	if ((phone || '').length < 10) return 'Phone number looks too short';
	return '';
}

export function validateAll(values: FormValues): FormErrors {
	const e: FormErrors = {};

	const be = validateBusinessName(values.businessName);
	if (be) e.businessName = be;

	const ee = validateEmail(values.email);
	if (ee) e.email = ee;

	const pe = validatePassword(values.password);
	if (pe) e.password = pe;

	const pho = validatePhone(values.phone);
	if (pho) e.phone = pho;

	return e;
}
