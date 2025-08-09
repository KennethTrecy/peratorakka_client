import type {
	PrecisionFormat,
	Currency,
	ItemDetail,
	AcceptableFinancialEntryAtomKind
} from "+/entity"

import { QUANTITY_FINANCIAL_ENTRY_ATOM_KIND, PRICE_FINANCIAL_ENTRY_ATOM_KIND } from "#/entity"

import formatAmount from "$/utility/format_amount"
import formatQuantity from "$/utility/format_quantity"

export default function formatNumber(
	currencyPrecisionFormat: PrecisionFormat | undefined,
	currency: Currency | undefined,
	itemDetailPrecisionFormat: PrecisionFormat | undefined,
	itemDetail: ItemDetail | undefined,
	kind: AcceptableFinancialEntryAtomKind,
	numericalValue: string
): string {
	let formattedNumber = kind === QUANTITY_FINANCIAL_ENTRY_ATOM_KIND
		? formatQuantity(
			itemDetailPrecisionFormat,
			itemDetail,
			numericalValue
		) : formatAmount(
			currencyPrecisionFormat,
			currency,
			numericalValue
		)

	if (kind === PRICE_FINANCIAL_ENTRY_ATOM_KIND) {
		formattedNumber = `${formattedNumber}/${itemDetail?.unit ?? "---"}`
	}

	return formattedNumber
}
