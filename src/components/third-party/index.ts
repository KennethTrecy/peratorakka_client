import Fraction from "fraction.js"
import { Chart as ChartJS } from "chart.js"

import type { PrecisionFormat, Currency, ItemDetail } from "+/entity"

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
	return `${currency?.code ?? "---"} ${makeFormattedNumber(precisionFormat, amount)}`
}

export function makeFormattedQuantity(
	precisionFormat: PrecisionFormat | undefined,
	itemDetail: ItemDetail | undefined,
	amount: string
): string {
	return `${makeFormattedNumber(precisionFormat, amount)} ${itemDetail?.unit ?? "---"}`
}

export function makeFormattedNumber(
	precisionFormat: PrecisionFormat | undefined,
	amount: string
): string {
	const emptyAmount = makeRawFormattedNumber(precisionFormat, "0")
	const formattedAmount = makeRawFormattedNumber(precisionFormat, amount)

	return emptyAmount === formattedAmount
		? amount
		: formattedAmount
}

export function makeRawFormattedNumber(
	precisionFormat: PrecisionFormat | undefined,
	amount: string
): string {
	const minimumFractionDigits = precisionFormat?.minimum_presentational_precision
		?? DEFAULT_MINIMUM_FRACTION_DIGITS
	const maximumFractionDigits = precisionFormat?.maximum_presentational_precision
		?? DEFAULT_MAXIMUM_FRACTION_DIGITS

	const untrimmedAmount = (
		+(new Fraction(amount))
		.round(maximumFractionDigits)
		.toString(maximumFractionDigits)
	).toLocaleString("en-US", {
		"useGrouping": "true",
		"minimumFractionDigits": minimumFractionDigits,
		"maximumFractionDigits": maximumFractionDigits
	}).replaceAll(",", " ")

	const trimmedAmount = untrimmedAmount.split(".")
	const whole = trimmedAmount[0]
	let rawFraction = trimmedAmount[1] ?? ""
	rawFraction = `${rawFraction}${
		Array(Math.max(maximumFractionDigits - rawFraction.length, 0)).fill("-").join("")
	}`
	rawFraction = rawFraction.length === 0
		? ""
		: `.${rawFraction}`

	const formattedAmount = `${whole}${rawFraction}`

	return formattedAmount
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
