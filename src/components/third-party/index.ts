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
		if (untrimmedAmount[i] === "0") {
			untrimmedAmount.pop()
		} else {
			break;
		}
	}

	const formattedAmount = untrimmedAmount.join("")

	return `${currency?.code ?? "---"} ${formattedAmount}`
}

export function setTheme(filename: string): void {

}

export function setMode(modeName: string): void {

}
