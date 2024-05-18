import type { ChoiceInfo } from "+/component"
import type { CashFlowCategory } from "+/entity"

import { NO_CASH_FLOW_CATEGORY_CATEGORY } from "#/component"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

export default function transformCashFlowCategory(category: CashFlowCategory): ChoiceInfo {
	const data = `${category.id}`
	const label = `${category.name} ${
		category.id === NO_CASH_FLOW_CATEGORY_CATEGORY.id
			? ""
			: ` — ${convertSnakeCaseToProperCase(category.kind)}`
	}`

	return {
		label,
		data
	}
}
