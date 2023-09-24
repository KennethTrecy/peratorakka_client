import type { ChoiceInfo } from "+/component"

import transformString from "$/form/choice_info_transformer/transform_string"

export default function transformAttributeName(snakeCaseName: string): ChoiceInfo {
	const {
		label,
		data
	} = transformString(snakeCaseName)
	const modifiedLabel = label.replace(/At$/, "Date")

	return {
		"label": modifiedLabel,
		data
	}
}
