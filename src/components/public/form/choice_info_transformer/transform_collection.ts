import type { ChoiceInfo } from "+/component"
import type { Collection } from "+/entity"

export default function transformCollection(collection: Collection): ChoiceInfo {
	const data = `${collection.id}`

	const label = collection.name

	return {
		label,
		data
	}
}
