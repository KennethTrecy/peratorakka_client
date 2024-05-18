import type {
	AcceptableCashFlowCategoryKind,
	AcceptableAccountKind,
	SummaryCalculation
} from "+/entity"

import { acceptableAccountKinds, acceptableCashFlowCategoryKinds } from "#/entity"

import { addAmount, subtractAmount } from "!/index"

export default function calculateFlowedAmount(
	cashFlowCategoryKind: AcceptableCashFlowCategoryKind,
	accountKind: AcceptableAccountKind,
	data: SummaryCalculation
): string {
	if (cashFlowCategoryKind === acceptableCashFlowCategoryKinds[0]) {
		// Liquid
		if (accountKind === acceptableAccountKinds[0]) {
			// Asset
			return subtractAmount(data.opened_debit_amount, data.opened_credit_amount)
		} else if (accountKind === acceptableAccountKinds[3]) {
			// Expense
			return subtractAmount(data.unadjusted_debit_amount, data.unadjusted_credit_amount)
		}
	} else if (cashFlowCategoryKind === acceptableCashFlowCategoryKinds[1]) {
		// Illiquid
		switch(accountKind) {
			case acceptableAccountKinds[0]: // Asset
			case acceptableAccountKinds[1]: // Liability
				return addAmount(
					subtractAmount(data.opened_debit_amount, data.closed_debit_amount),
					subtractAmount(data.closed_credit_amount, data.opened_credit_amount)
				);
			case acceptableAccountKinds[2]: // Equity
				return addAmount(
					subtractAmount(data.opened_debit_amount, data.unadjusted_debit_amount),
					subtractAmount(data.unadjusted_credit_amount, data.opened_credit_amount)
				);
		}
	}

	return "0"
}
