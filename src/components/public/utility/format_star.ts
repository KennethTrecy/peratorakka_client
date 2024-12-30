import type { Currency, AcceptableFormulaOutputFormat } from "+/entity"
import type { Star } from "+/rest"

import {
	CURRENCY_FORMULA_OUTPUT_FORMAT,
	PERCENTAGE_FORMULA_OUTPUT_FORMAT
} from "#/entity"

import { makeFormattedAmount } from "!/index"
import cleanValue from "$/utility/clean_value"
import parenthesizeValue from "$/utility/parenthesize_value"

export default function formatStar(
	outputFormat: AcceptableFormulaOutputFormat,
	currency: Currency|null,
	star: Star
): string {
	const [ isNegative, cleanAmount ] = cleanValue(star.display_value)
	const formattedAmount = parenthesizeValue(
		isNegative,
		outputFormat === CURRENCY_FORMULA_OUTPUT_FORMAT
			? makeFormattedAmount(currency ?? undefined, cleanAmount)
			: outputFormat === PERCENTAGE_FORMULA_OUTPUT_FORMAT
				? `${cleanAmount}%`
				: cleanAmount
	)

	return formattedAmount
}
