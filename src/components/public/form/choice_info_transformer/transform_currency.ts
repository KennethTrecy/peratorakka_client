import type { ChoiceInfo } from "+/component"
import type { Currency } from "+/entity"

import { ANY_CURRENCY } from "#/component"

export default function transformCurrency(currency: Currency): ChoiceInfo {
	const data = `${currency.id}`

	if (currency.id === ANY_CURRENCY.id) {
		return {
			"label": currency.name,
			data
		}
	}

	const label = `${currency.code} (${currency.name})`

	return {
		label,
		data
	}
}
