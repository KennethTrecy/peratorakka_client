export default function separateNumericParts(shownAmount: string): [
	string,
	string,
	string,
	string
] {
	const hasDecimalPoint = shownAmount.indexOf(".") > -1
	const hasPurelyInvisibleDecimalPoint = hasDecimalPoint && shownAmount.indexOf(".-") > -1
	const parts = hasDecimalPoint ? shownAmount.split(".") : [ shownAmount ]
	const wholePart = parts[0]
	const decimalPart = parts[1] ?? ""
	const visibleDecimalPart = (
		!hasDecimalPoint || hasPurelyInvisibleDecimalPoint
			? ""
			: `.${decimalPart.slice(0, decimalPart.lastIndexOf("0") + 1)}`
	)
	const invisbleDecimalPart = (hasPurelyInvisibleDecimalPoint ? "." : "" ) + decimalPart.slice(
		visibleDecimalPart.length + (hasPurelyInvisibleDecimalPoint ? 0 : -1),
		decimalPart.lastIndexOf("-") + 1
	).replaceAll("-", "0")
	const postDecimalPart = decimalPart.slice(
		visibleDecimalPart.length
		+ invisbleDecimalPart.length
		+ (hasDecimalPoint ? -1 : 0)
	)

	return [ wholePart, visibleDecimalPart, invisbleDecimalPart, postDecimalPart ]
}
