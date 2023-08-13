import type { ChoiceInfo } from "+/component"
import type { Account } from "+/entity"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

export default function transformAccount(account: Account): ChoiceInfo {
	const data = `${account.id}`
	const label = `${account.name} (${convertSnakeCaseToProperCase(account.kind)})`

	return {
		label,
		data
	}
}
