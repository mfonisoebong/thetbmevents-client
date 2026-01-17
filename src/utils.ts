import {PaymentGateway} from "./types";

const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const day = String(d.getDate()).padStart(2, '0')
    const month = months[d.getMonth()] || ''
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
}

const currencySymbol = (code?: string) => {
  if (!code) return ''
  const map: Record<string, string> = {
    NGN: '₦',
    USD: '$',
  }
  return map[code.toUpperCase()] ?? code
}

function getGatewayFee(amount : number, gateway: PaymentGateway): number {
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

export { formatDate, currencySymbol, getGatewayFee };
