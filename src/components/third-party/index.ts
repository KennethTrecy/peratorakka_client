import Fraction from "fraction.js"
import tinycolor from "tinycolor2"
import { Chart, Chart as ChartJS } from "chart.js"

import type { Currency } from "+/entity"

import { DEFAULT_MINIMUM_FRACTION_DIGITS, DEFAULT_MAXIMUM_FRACTION_DIGITS } from "#/component"
import { DARK_MODE } from "#/theme"

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

	return makeFormattedAmount(currency, formattedAmount)
}

export function makeFormattedAmount(currency: Currency | undefined, amount: string): string {
	return `${currency?.code ?? "---"} ${(+amount).toLocaleString("en-US", {
		"useGrouping": "true",
		"minimumFractionDigits": (
			currency?.presentational_precision ?? DEFAULT_MINIMUM_FRACTION_DIGITS
		),
		"maximumFractionDigits": currency?.presentational_precision ?? DEFAULT_MAXIMUM_FRACTION_DIGITS
	}).replaceAll(",", " ")}`
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

export function makeHSVColorAsRGBColor(hue: number, saturation: number, value: number): string {
	return tinycolor({ "h": hue, "s": saturation, "v": value }).toHexString()
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
