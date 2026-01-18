import {PaymentGateway} from "./types";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";

export const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    const day = String(d.getDate()).padStart(2, '0')
    const month = months[d.getMonth()] || ''
    const year = d.getFullYear()

    return `${day} ${month} ${year}`
}

export const currencySymbol = (code?: string) => {
  if (!code) return ''

  const map: Record<string, string> = {
    NGN: '₦',
    USD: '$',
  }

  return map[code.toUpperCase()] ?? code
}

export function getGatewayFee(amount : number, gateway: PaymentGateway): number {
    const calcPaystackCharges = (price: number): number => {
        const flatFee = price >= 2500 ? 100 : 0;
        const feeCap = 2000;
        const decFee = 0.015;

        const appFee = Math.round(((decFee * price) + flatFee) * 100) / 100;

        if (appFee > feeCap) {
            return feeCap;
        }

        let finalPrice = Math.round((((price + flatFee) / (1 - decFee)) + 0.01) * 100) / 100;

        if (price < 2500 && finalPrice >= 2500) {
            finalPrice += 120;
        }

        return Math.round((finalPrice - price) * 100) / 100;
    };

    if (gateway === 'flutterwave') {
        return amount * 0.02;
    }

    if (gateway === 'paystack') {
        return calcPaystackCharges(amount);
    }

    return 0;
}

export function classNames(...classes : string[]) {
    return classes.filter(Boolean).join(' ')
}

export function roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function formatNumber(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; domain=${getTLD()}; path=/;`;
}

export function getTLD() {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;

        // if localhost or ip address, return it
        if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            return hostname;
        }

        return hostname.split('.').slice(-2).join('.');
    }
}

export function deleteCookie(name: string) {
    if (typeof window !== "undefined") {
        document.cookie = name + '=; Max-Age=-99999999;path=/';
    }
}

export function getBaseURL() {
    return process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEBUG_API_URL : process.env.NEXT_PUBLIC_API_URL
}

export function getEndpoint(endpoint: string, prefix: string = '/v2') {
    return getBaseURL() + prefix + endpoint;
}

export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("");
}

export function getCookie(name: string) {
    if (typeof window !== "undefined") {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        var i;
        for (i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}
