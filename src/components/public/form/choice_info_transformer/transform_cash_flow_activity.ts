import type { ChoiceInfo } from "+/component"
import type { CashFlowActivity } from "+/entity"

export default function transformCashFlowActivity(activity: CashFlowActivity): ChoiceInfo {
	const data = `${activity.id}`
	const label = activity.name

	return {
		label,
		data
	}
}
