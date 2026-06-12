import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "ro-RO",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const code = currency_code.toUpperCase()

  // RON → format românesc "1.299 lei" (zecimalele apar doar când există fracție,
  // ex. "19,99 lei"). Separatorul de mii e punct, cel zecimal e virgulă.
  if (code === "RON") {
    const hasFraction = Math.round(amount * 100) % 100 !== 0
    const formatted = new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: minimumFractionDigits ?? (hasFraction ? 2 : 0),
      maximumFractionDigits: maximumFractionDigits ?? 2,
    }).format(amount)
    return `${formatted} lei`
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}
