import type { ChoiceInfo } from "+/component"
import type { Modifier } from "+/entity"

export default function transformModifier(modifier: Modifier): ChoiceInfo {
	const data = `${modifier.id}`
	const label = `${modifier.name}`

	return {
		label,
		data
	}
}
