import type { Currency } from "+/entity"


import { subtractAmount } from "!/index"

export default function resolvedAmount(mainAmmount: string, oppositeAmount: string): string {
	const pendingAmount = subtractAmount(mainAmmount, oppositeAmount)
	const isNegative = pendingAmount.startsWith("-")
	const resolvedAmount = isNegative ? "0": pendingAmount

	return resolvedAmount
}
