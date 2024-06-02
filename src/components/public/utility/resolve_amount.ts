import { subtractAmount } from "!/index"

import { EMPTY_AMOUNT } from "#/component"

export default function resolveAmount(mainAmmount: string, oppositeAmount: string): string {
	const pendingAmount = subtractAmount(mainAmmount, oppositeAmount)
	const isNegative = pendingAmount.startsWith("-")
	const resolvedAmount = isNegative ? EMPTY_AMOUNT: pendingAmount

	return resolvedAmount
}
