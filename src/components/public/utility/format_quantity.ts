import type { PrecisionFormat, ItemDetail } from "+/entity"

import { makeFormattedQuantity } from "!/index"
import cleanValue from "$/utility/clean_value"
import parenthesizeValue from "$/utility/parenthesize_value"

export default function formatQuantity(
	precisionFormat: PrecisionFormat | undefined,
	itemDetail: ItemDetail | undefined,
	quantity: string
): string {
	const [ isNegative, cleanQuantity ] = cleanValue(quantity)

	return parenthesizeValue(isNegative, makeFormattedQuantity(
		precisionFormat,
		itemDetail,
		cleanQuantity
	))
}
