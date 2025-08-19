import type { CensoredAccount, SimplifiedSummaryCalculation } from "+/component"

import {
	CENSORSHIP_HIDE_ACCOUNT_AND_AFFECTED_NUMBERS,
	CENSORSHIP_OBSECURED_ACCOUNT_AND_AFFECTED_NUMBERS,
	CENSORSHIP_OBSECURED_ACCOUNT_ONLY,
	CENSORSHIP_OBSECURED_AFFECTED_NUMBERS,
	CENSORSHIP_OBSECURED_AMOUNT_ONLY
} from "#/component"

import censorLabel from "%/frozen_periods/financial_statements/censor_label"
import censorNumber from "%/frozen_periods/financial_statements/censor_number"

export default function censorSummaryCalculations(
	censoredAccounts: CensoredAccount[],
	data: SimplifiedSummaryCalculation[]
): SimplifiedSummaryCalculation[] {
	return data.map(calculation => {
		let { account, debitAmount, creditAmount } = calculation
		let newAccount = { ...account }
		const censorshipInfo = censoredAccounts.find(info => info[0].id === account.id) ?? null

		if (censorshipInfo === null) {
			return calculation
		}

		const censorshipVariant = censorshipInfo[1]
		switch (censorshipVariant) {
			case CENSORSHIP_OBSECURED_ACCOUNT_AND_AFFECTED_NUMBERS:
			case CENSORSHIP_OBSECURED_ACCOUNT_ONLY:
				newAccount.name = censorLabel(newAccount.name)
				if (censorshipVariant === CENSORSHIP_OBSECURED_ACCOUNT_ONLY) {
					break;
				}

			case CENSORSHIP_OBSECURED_AFFECTED_NUMBERS:
			case CENSORSHIP_OBSECURED_AMOUNT_ONLY:
				debitAmount = censorNumber(debitAmount)
				creditAmount = censorNumber(creditAmount)

				break;

			case CENSORSHIP_HIDE_ACCOUNT_AND_AFFECTED_NUMBERS:
				newAccount.name = ""
				debitAmount = ""
				creditAmount = ""

				break;
		}
		return {
			"account": newAccount,
			debitAmount,
			creditAmount
		}
	}).filter(calculation => !(
		calculation.account.name === ""
		&& calculation.debitAmount === ""
		&& calculation.creditAmount === ""
	))
}
