import Fraction from "fraction.js"

import type { Currency } from "+/entity"

export function formatAmount(
	currency: Currency | undefined,
	amount: string,
	minimumFractionDigits: number,
	maximumFractionDigits: number
) {
	const parsedAmount = new Fraction(amount)
	const untrimmedAmount = parsedAmount
		.round(maximumFractionDigits)
		.toString(maximumFractionDigits)

	const trimmedAmount = untrimmedAmount.split(".")
	const whole = trimmedAmount[0]
	let rawFraction = trimmedAmount[1] ?? ""
	rawFraction = `${rawFraction}${
		Array(Math.max(minimumFractionDigits - rawFraction.length, 0)).fill(0).join("")
	}`
	rawFraction = rawFraction.length === 0
		? ""
		: `.${rawFraction}`

	const formattedAmount = `${whole}${rawFraction}`

	return `${currency?.code ?? "---"} ${formattedAmount}`
}

export function addAmount(addend: string, adder: string): string {
	return new Fraction(addend).add(adder).toString()
}

export function subtractAmount(subtrahend: string, minuend: string): string {
	return new Fraction(subtrahend).sub(minuend).toString()
}

export function multiplyAmount(multiplicand: string, multiplier: string): string {
	Fraction.REDUCE = true;
	return new Fraction(multiplicand).mul(multiplier).toString()
}

export function divideAmount(dividend: string, divisor: string): string {
	Fraction.REDUCE = true;
	return new Fraction(dividend).div(divisor).toFraction()
}

export function setTheme(filename: string): void {

}

export function setMode(modeName: string): void {

}
