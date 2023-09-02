import Fraction from "fraction.js"

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
		.split("")

	for (let i = untrimmedAmount.length - 1; i >= 0; ++i) {
		if (untrimmedAmount[i] === "0" && i > minimumFractionDigits) {
			untrimmedAmount.pop()
		} else {
			break;
		}
	}

	const trimmedAmount = untrimmedAmount.join("").split(".")
	const whole = trimmedAmount[0]
	let rawFraction = trimmedAmount[1] ?? ""
	rawFraction = `${rawFraction}${
		Array(minimumFractionDigits - rawFraction.length).fill(0).join("")
	}`
	rawFraction = rawFraction.length === 0
		? ""
		: `.${rawFraction}`

	const formattedAmount = `${whole}${rawFraction}`


	return `${currency?.code ?? "---"} ${formattedAmount}`
}

export function setTheme(filename: string): void {

}

export function setMode(modeName: string): void {

}
