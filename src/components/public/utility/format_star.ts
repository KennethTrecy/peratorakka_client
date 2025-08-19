import type { PrecisionFormat, Currency, AcceptableFormulaOutputFormat } from "+/entity"
import type { Star } from "+/rest"

import {
	CURRENCY_FORMULA_OUTPUT_FORMAT,
	PERCENTAGE_FORMULA_OUTPUT_FORMAT
} from "#/entity"

import { makeFormattedAmount, makeRawFormattedNumber } from "!/index"
import cleanValue from "$/utility/clean_value"
import dashValue from "$/utility/dash_value"

export default function formatStar(
	outputFormat: AcceptableFormulaOutputFormat,
	associatedPrecisionFormat: PrecisionFormat | null,
	currency: Currency|null,
	star: Star
): string {
	const [ isNegative, cleanAmount ] = cleanValue(star.display_value)
	let formattedNumber = ""

	if (outputFormat === CURRENCY_FORMULA_OUTPUT_FORMAT) {
		formattedNumber = dashValue(isNegative, makeFormattedAmount(
			associatedPrecisionFormat ?? undefined,
			currency ?? undefined,
			cleanAmount
		))
	} else if (outputFormat === PERCENTAGE_FORMULA_OUTPUT_FORMAT) {
		formattedNumber = dashValue(isNegative, `${makeRawFormattedNumber(
			associatedPrecisionFormat ?? undefined,
			cleanAmount
		)}%`)
	} else {
		formattedNumber = dashValue(isNegative, cleanAmount)
	}

	formattedNumber = formattedNumber.replaceAll(/-+$/g, "")

	return formattedNumber
}
