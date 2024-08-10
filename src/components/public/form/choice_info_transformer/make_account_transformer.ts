import type { ChoiceInfo } from "+/component"
import type { Account, Currency } from "+/entity"

import { ANY_ACCOUNT } from "#/component"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

export default function makeAccountTransformer(currencies: Currency[]) {
	return (account: Account): ChoiceInfo => {
		const data = `${account.id}`

		if (account.id === ANY_ACCOUNT.id) {
			return {
				"label": account.name,
				data
			}
		}

		const kind = convertSnakeCaseToProperCase(account.kind)
		const currencyInfo = currencies.find(currency => currency.id === account.currency_id)
		const currencyCode = currencyInfo?.code ?? "Unknown"
		const label = `${account.name} (${kind} — ${currencyCode})`

		return {
			label,
			data
		}
	}
}
