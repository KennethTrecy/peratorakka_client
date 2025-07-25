import Fraction from "fraction.js"
import { Chart as ChartJS } from "chart.js"

import type { PrecisionFormat, Currency } from "+/entity"

import { DEFAULT_MINIMUM_FRACTION_DIGITS, DEFAULT_MAXIMUM_FRACTION_DIGITS } from "#/component"
import { DARK_MODE } from "#/theme"

export function formatAmount(
	precisionFormat: PrecisionFormat | undefined,
	currency: Currency | undefined,
	amount: string
) {
	return makeFormattedAmount(precisionFormat, currency, amount)
}

export function makeFormattedAmount(
	precisionFormat: PrecisionFormat | undefined,
	currency: Currency | undefined,
	amount: string
): string {
	const emptyAmount = makeRawFormattedAmount(precisionFormat, "0")
	const formattedAmount = makeRawFormattedAmount(precisionFormat, amount)
	const isInfinitesimalAmount = emptyAmount === formattedAmount

	return `${currency?.code ?? "---"} ${
		isInfinitesimalAmount
			? amount
			: formattedAmount
	}`
}

export function makeRawFormattedAmount(
	precisionFormat: PrecisionFormat | undefined,
	amount: string
): string {
	const minimumFractionDigits = precisionFormat?.minimum_presentational_precision
		?? DEFAULT_MINIMUM_FRACTION_DIGITS
	const maximumFractionDigits = precisionFormat?.maximum_presentational_precision
		?? DEFAULT_MAXIMUM_FRACTION_DIGITS

	return (new Fraction(amount))
		.round(maximumFractionDigits)
		.toString(maximumFractionDigits)
}

export function addAmount(addend: string, adder: string): string {
	return new Fraction(addend).add(adder).toFraction()
}

export function subtractAmount(subtrahend: string, minuend: string): string {
	return new Fraction(subtrahend).sub(minuend).toFraction()
}

export function multiplyAmount(multiplicand: string, multiplier: string): string {
	// @ts-ignore
	Fraction.REDUCE = true;
	return new Fraction(multiplicand).mul(multiplier).toFraction()
}

export function divideAmount(dividend: string, divisor: string): string {
	// @ts-ignore
	Fraction.REDUCE = true;
	try {
		return new Fraction(dividend).div(divisor).toFraction()
	} catch(error) {
		console.error("Division error: ", error)
		console.log(`Dividend: ${dividend}`)
		console.log(`Divisor: ${divisor}`)
		return "0"
	}
}

export function setTheme(filename: string): void {

}

export function setMode(modeName: string): void {
	ChartJS.defaults.color = modeName === DARK_MODE
		? "#DDD"
		: "#222"
	ChartJS.defaults.borderColor = modeName === DARK_MODE
		? "#222"
		: "#DDD"
}
