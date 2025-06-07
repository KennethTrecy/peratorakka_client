import type { ChoiceInfo } from "+/component"
import type { PrecisionFormat } from "+/entity"

export default function transformPrecisionFormat(precisionFormat: PrecisionFormat): ChoiceInfo {
	const data = `${precisionFormat.id}`
	const label = `${precisionFormat.name} (${precisionFormat.minimum_presentational_precision}-${precisionFormat.maximum_presentational_precision} digits)`

	return {
		label,
		data
	}
}
