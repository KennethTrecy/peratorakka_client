import type { CensoredAccount, SimplifiedFlowCalculation } from "+/component"
import type { FinancialStatementGroup } from "+/rest"

import {
	CENSORSHIP_HIDE_ACCOUNT_AND_AFFECTED_NUMBERS,
	CENSORSHIP_OBSECURED_ACCOUNT_AND_AFFECTED_NUMBERS,
	CENSORSHIP_OBSECURED_AFFECTED_NUMBERS
} from "#/component"
import {
	DEPRECIATIVE_ASSET_ACCOUNT_KIND,
	DIRECT_COST_ACCOUNT_KIND,
	EQUITY_ACCOUNT_KIND,
	GENERAL_ASSET_ACCOUNT_KIND,
	GENERAL_EXPENSE_ACCOUNT_KIND,
	GENERAL_REVENUE_ACCOUNT_KIND,
	GENERAL_TEMPORARY_ACCOUNT_KIND,
	ITEMIZED_ASSET_ACCOUNT_KIND,
	LIABILITY_ACCOUNT_KIND,
	LIQUID_ASSET_ACCOUNT_KIND,
	NOMINAL_RETURN_ACCOUNT_KIND
} from "#/entity"

import censorNumber from "%/frozen_periods/financial_statements/censor_number"

export default function censorStatementGroup(
	censoredAccounts: CensoredAccount[],
	flowCalculations: SimplifiedFlowCalculation[],
	data: FinancialStatementGroup<string>
): FinancialStatementGroup<string> {
	let mustCensorUnadjustedTrialBalances = false
	let mustCensorAdjustedTrialBalances = false
	let mustCensorAssetTotals = false
	let mustCensorLiabilityTotals = false
	let mustCensorEquityTotals = false
	let mustCensorIncomeStatementTotals = false
	const newFinancialStatementGroup = JSON.parse(JSON.stringify(data)) as FinancialStatementGroup<string>
	const affectedNetIncomeCashFlowActivityIDs = [] as number[]
	const affectedSubtotalCashFlowActivityIDs = [] as number[]

	for (const censorAccountInfo of censoredAccounts) {
		const [ account, censorshipVariant ] = censorAccountInfo
		switch (censorshipVariant) {
			case CENSORSHIP_HIDE_ACCOUNT_AND_AFFECTED_NUMBERS:
			case CENSORSHIP_OBSECURED_ACCOUNT_AND_AFFECTED_NUMBERS:
			case CENSORSHIP_OBSECURED_AFFECTED_NUMBERS:
				const accountKind = account.kind
				switch (accountKind) {
					case GENERAL_ASSET_ACCOUNT_KIND:
					case LIQUID_ASSET_ACCOUNT_KIND:
					case DEPRECIATIVE_ASSET_ACCOUNT_KIND:
					case ITEMIZED_ASSET_ACCOUNT_KIND:
					case LIABILITY_ACCOUNT_KIND:
					case EQUITY_ACCOUNT_KIND:
						mustCensorAdjustedTrialBalances = true

					case GENERAL_EXPENSE_ACCOUNT_KIND:
					case GENERAL_REVENUE_ACCOUNT_KIND:
					case GENERAL_TEMPORARY_ACCOUNT_KIND:
					case NOMINAL_RETURN_ACCOUNT_KIND:
					case DIRECT_COST_ACCOUNT_KIND:
						mustCensorUnadjustedTrialBalances = true
						break;
				}
				switch (accountKind) {
					case GENERAL_ASSET_ACCOUNT_KIND:
					case LIQUID_ASSET_ACCOUNT_KIND:
					case DEPRECIATIVE_ASSET_ACCOUNT_KIND:
					case ITEMIZED_ASSET_ACCOUNT_KIND:
						mustCensorAssetTotals = true
						break;

					case LIABILITY_ACCOUNT_KIND:
						mustCensorLiabilityTotals = true
						break;

					case EQUITY_ACCOUNT_KIND:
						mustCensorEquityTotals = true
						break;

					case GENERAL_EXPENSE_ACCOUNT_KIND:
					case GENERAL_REVENUE_ACCOUNT_KIND:
					case GENERAL_TEMPORARY_ACCOUNT_KIND:
					case NOMINAL_RETURN_ACCOUNT_KIND:
					case DIRECT_COST_ACCOUNT_KIND:
						mustCensorIncomeStatementTotals = true
						break;
				}

				const flowCalculationIndex = flowCalculations.findIndex(
					flowCalculation => flowCalculation.account.id === account.id
				)

				if (flowCalculationIndex > -1) {
					switch (accountKind) {
						case GENERAL_EXPENSE_ACCOUNT_KIND:
						case GENERAL_REVENUE_ACCOUNT_KIND:
						case GENERAL_TEMPORARY_ACCOUNT_KIND:
						case NOMINAL_RETURN_ACCOUNT_KIND:
						case DIRECT_COST_ACCOUNT_KIND:
							affectedNetIncomeCashFlowActivityIDs.push(
								flowCalculations[flowCalculationIndex].cashFlowActivity.id
							)

						case GENERAL_ASSET_ACCOUNT_KIND:
						case LIQUID_ASSET_ACCOUNT_KIND:
						case DEPRECIATIVE_ASSET_ACCOUNT_KIND:
						case ITEMIZED_ASSET_ACCOUNT_KIND:
						case LIABILITY_ACCOUNT_KIND:
						case EQUITY_ACCOUNT_KIND:
							affectedSubtotalCashFlowActivityIDs.push(
								flowCalculations[flowCalculationIndex].cashFlowActivity.id
							)
							break;
					}

				}

				break;
		}
	}

	if (mustCensorUnadjustedTrialBalances) {
		newFinancialStatementGroup.unadjusted_trial_balance.debit_total = censorNumber(
			newFinancialStatementGroup.unadjusted_trial_balance.debit_total
		)

		newFinancialStatementGroup.unadjusted_trial_balance.credit_total = censorNumber(
			newFinancialStatementGroup.unadjusted_trial_balance.credit_total
		)
	}

	if (mustCensorAdjustedTrialBalances) {
		newFinancialStatementGroup.adjusted_trial_balance.debit_total = censorNumber(
			newFinancialStatementGroup.adjusted_trial_balance.debit_total
		)

		newFinancialStatementGroup.adjusted_trial_balance.credit_total = censorNumber(
			newFinancialStatementGroup.adjusted_trial_balance.credit_total
		)
	}

	if (mustCensorAssetTotals) {
		newFinancialStatementGroup.balance_sheet.total_assets = censorNumber(
			newFinancialStatementGroup.balance_sheet.total_assets
		)
	}

	if (mustCensorLiabilityTotals) {
		newFinancialStatementGroup.balance_sheet.total_liabilities = censorNumber(
			newFinancialStatementGroup.balance_sheet.total_liabilities
		)
	}

	if (mustCensorEquityTotals) {
		newFinancialStatementGroup.balance_sheet.total_equities = censorNumber(
			newFinancialStatementGroup.balance_sheet.total_equities
		)
	}

	if (mustCensorIncomeStatementTotals) {
		newFinancialStatementGroup.income_statement.net_total = censorNumber(
			newFinancialStatementGroup.income_statement.net_total
		)

		newFinancialStatementGroup.balance_sheet.total_equities = censorNumber(
			newFinancialStatementGroup.balance_sheet.total_equities
		)
	}

	if (
		affectedNetIncomeCashFlowActivityIDs.length > 0
		|| affectedSubtotalCashFlowActivityIDs.length > 0
	) {
		newFinancialStatementGroup.cash_flow_statement.subtotals
			= newFinancialStatementGroup.cash_flow_statement.subtotals.map(subtotal => {
				if (affectedNetIncomeCashFlowActivityIDs.includes(subtotal.cash_flow_activity_id)) {
					subtotal.net_income = censorNumber(subtotal.net_income)
				}

				if (affectedSubtotalCashFlowActivityIDs.includes(subtotal.cash_flow_activity_id)) {
					subtotal.subtotal = censorNumber(subtotal.subtotal)
				}

				return subtotal
			})

		newFinancialStatementGroup.cash_flow_statement.opened_real_liquid_amount = censorNumber(
			newFinancialStatementGroup.cash_flow_statement.opened_real_liquid_amount
		)

		newFinancialStatementGroup.cash_flow_statement.closed_real_liquid_amount = censorNumber(
			newFinancialStatementGroup.cash_flow_statement.closed_real_liquid_amount
		)
	}

	return newFinancialStatementGroup
}
