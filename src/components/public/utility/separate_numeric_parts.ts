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
			: decimalPart.slice(
				0,
				(
					decimalPart.lastIndexOf("0") > -1
						? decimalPart.lastIndexOf("0")
						: (
							decimalPart.indexOf("-") > -1
								? decimalPart.indexOf("-") - 1
								: decimalPart.length - 1
						)
				) + 1
			)
	)
	const invisbleDecimalPart = decimalPart.slice(
		visibleDecimalPart.length,
		decimalPart.lastIndexOf("-") + 1
	).replaceAll("-", "0")
	const postDecimalPart = decimalPart.slice(visibleDecimalPart.length + invisbleDecimalPart.length)

	return [
		wholePart,
		(hasDecimalPoint && !hasPurelyInvisibleDecimalPoint ? "." : "")+visibleDecimalPart,
		(hasDecimalPoint && hasPurelyInvisibleDecimalPoint ? "." : "")+invisbleDecimalPart,
		postDecimalPart
	]
}
