import type { ChoiceInfo } from "+/component"
import type { ItemDetail } from "+/entity"

import { ANY_CURRENCY } from "#/component"

export default function transformItemDetail(itemDetail: ItemDetail): ChoiceInfo {
	const data = `${itemDetail.id}`

	if (itemDetail.id === ANY_CURRENCY.id) {
		return {
			"label": itemDetail.name,
			data
		}
	}

	const label = `${itemDetail.unit} (${itemDetail.name})`

	return {
		label,
		data
	}
}
