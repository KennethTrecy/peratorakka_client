import type { ChoiceInfo } from "+/component"
import type { Currency } from "+/entity"

export default function transformCurrency(currency: Currency): ChoiceInfo {
	const data = `${currency.id}`
	const label = `${currency.code} (${currency.name})`

	return {
		label,
		data
	}
}
