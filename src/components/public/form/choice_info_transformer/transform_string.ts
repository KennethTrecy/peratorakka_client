import type { ChoiceInfo } from "+/component"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

export default function transformString(snakeCaseName: string): ChoiceInfo {
	const data = snakeCaseName
	const label = convertSnakeCaseToProperCase(data)

	return {
		label,
		data
	}
}
