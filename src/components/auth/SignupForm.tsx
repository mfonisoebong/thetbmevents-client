"use client";

import React, {FormEvent, useEffect, useReducer} from 'react';
import PhoneInput from './PhoneInput';
import {FormErrors, validateAll} from '../../hooks/useFormValidation';
import useCountries from '../../hooks/useCountries';
import {SelectOption} from "@lib/types";
import {Dropdown} from "../Dropdown";
import HTTP from "@lib/HTTP";
import {getEndpoint, getErrorMessage} from "@lib/utils";
import Link from "next/link";
import {ArrowLeftIcon, ArrowPathIcon} from "@heroicons/react/24/outline";
import {errorToast} from "@components/Toast";

type Step = 'signup' | 'verify';

type SignupFormState = {
    step: Step;
    values: {
        businessName: string;
        email: string;
        password: string;
        phone: string;
    };
    selectedCountry: SelectOption;
    errors: FormErrors;
    message: string | null;
    ui: {
        loading: boolean;
        showPassword: boolean;
        resendLoading: boolean;
        resendSecondsLeft: number;
    };
};

type SignupFormAction =
    | { type: 'SET_STEP'; value: Step }
    | { type: 'SET_FIELD'; field: keyof SignupFormState['values']; value: string }
    | { type: 'SET_COUNTRY'; value: SelectOption }
    | { type: 'SET_ERRORS'; value: FormErrors }
    | { type: 'SET_LOADING'; value: boolean }
    | { type: 'TOGGLE_SHOW_PASSWORD' }
    | { type: 'SET_MESSAGE'; value: string | null }
    | { type: 'SET_RESEND_LOADING'; value: boolean }
    | { type: 'SET_RESEND_SECONDS'; value: number };

function getInitialState(): SignupFormState {
    return {
        step: 'signup',
        values: {
            businessName: '',
            email: '',
            password: '',
            phone: '',
        },
        selectedCountry: {label: "Nigeria (+234)", value: "NG"},
        errors: {},
        message: null,
        ui: {
            loading: false,
            showPassword: false,
            resendLoading: false,
            resendSecondsLeft: 0,
        },
    };
}

function reducer(state: SignupFormState, action: SignupFormAction): SignupFormState {
    switch (action.type) {
        case 'SET_STEP':
            return {...state, step: action.value};
        case 'SET_FIELD': {
            const nextErrors = state.errors?.[action.field]
                ? {...state.errors, [action.field]: undefined}
                : state.errors;

            return {
                ...state,
                values: {...state.values, [action.field]: action.value},
                errors: nextErrors,
            };
        }
        case 'SET_COUNTRY':
            return {...state, selectedCountry: action.value};
        case 'SET_ERRORS':
            return {...state, errors: action.value};
        case 'SET_LOADING':
            return {...state, ui: {...state.ui, loading: action.value}};
        case 'TOGGLE_SHOW_PASSWORD':
            return {...state, ui: {...state.ui, showPassword: !state.ui.showPassword}};
        case 'SET_MESSAGE':
            return {...state, message: action.value};
        case 'SET_RESEND_LOADING':
            return {...state, ui: {...state.ui, resendLoading: action.value}};
        case 'SET_RESEND_SECONDS':
            return {...state, ui: {...state.ui, resendSecondsLeft: action.value}};
        default:
            return state;
    }
}

export default function SignupForm() {
    const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

    useEffect(() => {
        if (state.step !== 'verify') return;
        if (state.ui.resendSecondsLeft <= 0) return;

        const id = window.setInterval(() => {
            dispatch({type: 'SET_RESEND_SECONDS', value: Math.max(0, state.ui.resendSecondsLeft - 1)});
        }, 1000);

        return () => window.clearInterval(id);
    }, [state.step, state.ui.resendSecondsLeft]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        dispatch({type: 'SET_MESSAGE', value: null});

        const vals = {
            ...state.values,
            country: state.selectedCountry.value.toString(),
        };

        const errs = validateAll(vals);
        dispatch({type: 'SET_ERRORS', value: errs});

        if (Object.keys(errs).length) return;

        dispatch({type: 'SET_LOADING', value: true});

        const response = await HTTP<any, any>({
            url: getEndpoint('/auth/signup'),
            data: {
                ...vals,
                business_name: vals.businessName.trim(),
                phone_number: vals.phone.trim(),
                businessName: undefined,
                phone: undefined,
            },
        });

        if (response.ok) {
            dispatch({type: 'SET_STEP', value: 'verify'});
            dispatch({type: 'SET_RESEND_SECONDS', value: 60});
        } else {
            errorToast(getErrorMessage(response.error))
            // dispatch({type: 'SET_MESSAGE', value: getErrorMessage(response.error)});
        }

        dispatch({type: 'SET_LOADING', value: false});
    }

    async function onResendOtp() {
        dispatch({type: 'SET_MESSAGE', value: null});

        if (state.ui.resendSecondsLeft > 0) return;

        dispatch({type: 'SET_RESEND_LOADING', value: true});

        const resp = await HTTP<any, { email: string }>({
            url: getEndpoint('/auth/resend-email-verification-link'),
            data: {email: state.values.email.trim()},
        });

        if (resp.ok) {
            dispatch({type: 'SET_RESEND_SECONDS', value: 60});
            dispatch({type: 'SET_MESSAGE', value: resp.data?.message ?? 'A new verification link has been sent.'});
        } else {
            dispatch({type: 'SET_MESSAGE', value: getErrorMessage(resp.error)});
        }

        dispatch({type: 'SET_RESEND_LOADING', value: false});
    }

    const {countries, loading: countriesLoading} = useCountries();

    if (state.step === 'verify') {
        return (
            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="mt-0.5 h-10 w-10 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.8">
                                <path
                                    d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Z"/>
                                <path d="m3.5 7.5 7.64 5.28a1.5 1.5 0 0 0 1.72 0L20.5 7.5"/>
                            </svg>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Check your inbox/spam folder</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                We sent a verification link to <span className="font-semibold">{state.values.email}</span>.
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tip: <b className="text-red-500">check your spam folder</b> if you do not see it in your inbox.</p>
                        </div>
                    </div>
                </div>

                {state.message && (
                    <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                        {state.message}
                    </p>
                )}

                <div className="flex items-center justify-between text-sm">
                    <button
                        type="button"
                        onClick={onResendOtp}
                        disabled={state.ui.resendLoading || state.ui.resendSecondsLeft > 0}
                        className="inline-flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 hover:underline disabled:opacity-60"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>
                            {state.ui.resendLoading ? 'Sending...'
                                : state.ui.resendSecondsLeft > 0 ? `Resend link in ${state.ui.resendSecondsLeft}s`
                                    : 'Resend verification link'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            dispatch({type: 'SET_STEP', value: 'signup'});
                            dispatch({type: 'SET_MESSAGE', value: null});
                        }}
                        className="text-slate-600 dark:text-slate-300 hover:underline"
                    >
                        <ArrowLeftIcon className="w-4 h-4 inline-block mr-1" />
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Business name</label>
                <input
                    value={state.values.businessName}
                    onChange={(e) => dispatch({type: 'SET_FIELD', field: 'businessName', value: e.target.value})}
                    className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm border border-gray-200 dark:border-slate-700"
                    placeholder="Your business name"
                />
                {state.errors.businessName && <p className="text-sm text-red-600 mt-1">{state.errors.businessName}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
                <input
                    value={state.values.email}
                    onChange={(e) => dispatch({type: 'SET_FIELD', field: 'email', value: e.target.value})}
                    type="email"
                    className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm border border-gray-200 dark:border-slate-700"
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
                            onChange={(opt) => dispatch({type: 'SET_COUNTRY', value: opt})}
                            customEl={(option) => (
                                <div
                                    className="flex gap-2 items-center p-2 text-sm text-black-1c dark:text-white hover:bg-gray-300 dark:hover:bg-white/10 cursor-pointer"
                                    key={option.value}
                                    onClick={option.onClick}
                                >
                                    <img src={'/images/flags/' + option.code?.toLowerCase() + '.svg'} alt=""
                                         className="w-7 h-5 inline-block"/>
                                    <span>{option.name}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <PhoneInput id="phone" value={state.values.phone}
                            onChangeAction={(v) => dispatch({type: 'SET_FIELD', field: 'phone', value: v})}/>
            </div>
            {state.errors.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                <div className="relative">
                    <input
                        value={state.values.password}
                        onChange={(e) => dispatch({type: 'SET_FIELD', field: 'password', value: e.target.value})}
                        type={state.ui.showPassword ? 'text' : 'password'}
                        className="mt-1 w-full rounded-lg bg-white/60 dark:bg-slate-900/50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:duration-200 shadow-sm border border-gray-200 dark:border-slate-700"
                        placeholder="Choose a strong password"
                    />
                    <button
                        type="button"
                        onClick={() => dispatch({type: 'TOGGLE_SHOW_PASSWORD'})}
                        aria-label={state.ui.showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-2 flex items-center text-slate-600 hover:text-slate-800"
                    >
                        {state.ui.showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor">
                                <path d="M2.5 12s3.5-7.5 9.5-7.5S21.5 12 21.5 12s-3.5 7.5-9.5 7.5S2.5 12 2.5 12z"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                <path d="M2 21 L23 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor">
                                <path d="M2.5 12s3.5-7.5 9.5-7.5S21.5 12 21.5 12s-3.5 7.5-9.5 7.5S2.5 12 2.5 12z"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                </div>
                {state.errors.password && <p className="text-sm text-red-600 mt-1">{state.errors.password}</p>}
            </div>

            <p className="text-sm">By signing up, you consent to our <Link href="/terms"
                                                                           className="text-brand-teal underline"
                                                                           target="_blank">Terms of Use</Link> and <Link
                href="/privacy" className="text-brand-teal underline" target="_blank">Privacy Policy.</Link></p>

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
