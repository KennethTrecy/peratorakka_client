<script lang="ts">
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type { SimplifiedSummaryCalculation, SimplifiedFlowCalculation } from "+/component"
import type {
	PrecisionFormat,
	Currency,
	CashFlowActivity,
	Account,
	FrozenAccount,
	RealAdjustedSummaryCalculation,
	RealUnadjustedSummaryCalculation,
	RealFlowCalculation
} from "+/entity"

import { ANY_CURRENCY } from "#/component"
import { ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY, normalDebitAccountKinds } from "#/entity"

import { subtractAmount } from "!/index"
import makeShownAmount from "$/utility/make_shown_amount"
import makeCleanShownAmount from "$/utility/make_clean_shown_amount"

import BalanceSheet from "%/frozen_periods/financial_statements/balance_sheet.svelte"
import CashFlowStatement from "%/frozen_periods/financial_statements/cash_flow_statement.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import IncomeStatement from "%/frozen_periods/financial_statements/income_statement.svelte"
import TrialBalance from "%/frozen_periods/financial_statements/trial_balance.svelte"
	import mergeUniqueElements from "$/utility/merge_unique_elements";

let {
	viewedCurrency,
	statement,
	resolvedExchangeRates,
	precisionFormats,
	currencies,
	cashFlowActivities,
	accounts,
	frozenAccounts,
	realAdjustedSummaryCalculations,
	realUnadjustedSummaryCalculations,
	realFlowCalculations
}: {
	viewedCurrency: Currency
	statement: FinancialStatementGroup
	resolvedExchangeRates: Record<string, ExchangeRateInfo>
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	cashFlowActivities: CashFlowActivity[]
	accounts: Account[]
	frozenAccounts: FrozenAccount[]
	realAdjustedSummaryCalculations: RealAdjustedSummaryCalculation[]
	realUnadjustedSummaryCalculations: RealUnadjustedSummaryCalculation[]
	realFlowCalculations: RealFlowCalculation[]
} = $props()

let statementCurrency = $derived(currencies.find(
	statementCurrency => statementCurrency.id === statement.currency_id
) ?? ANY_CURRENCY)
let mustShowAnyCurrency = $derived(statementCurrency.id === ANY_CURRENCY.id)
let allowedAccounts = $derived(accounts.filter(
	account => mustShowAnyCurrency || account.currency_id === statementCurrency.id
))
let allowedAccountIDs = $derived(allowedAccounts.map(account => account.id))
let allowedFrozenAccounts = $derived(frozenAccounts.filter(
	account => allowedAccountIDs.indexOf(account.account_id) > -1)
)

let statementExchangeRate = $derived((
	mustShowAnyCurrency
		? resolvedExchangeRates[viewedCurrency.id]
		:  resolvedExchangeRates[statement.currency_id]
) ?? {
	"source": {
		"currency_id": statement.currency_id,
		"value": "1"
	},
	"destination": {
		"currency_id": statement.currency_id,
		"value": "1"
	},
	"updated_at": (new Date()).toDateString()
})
let emptyAmount = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	"0"
))
let allowedRealAdjustedSummaryCalculations = $derived(realAdjustedSummaryCalculations.map(
	calculation => {
		const frozenAccountIndex = allowedFrozenAccounts.findIndex(
			account => account.hash === calculation.frozen_account_hash
		)

		if (frozenAccountIndex === -1) return null

		const frozenAccount = allowedFrozenAccounts[frozenAccountIndex]
		const accountIndex = allowedAccounts.findIndex(
			account => account.id === frozenAccount.account_id
		)

		if (accountIndex === -1) return null

		const account = allowedAccounts[accountIndex]
		const isAccountNormallyDebited = normalDebitAccountKinds.indexOf(account.kind) > -1
		const resolvedAmount = calculation.closed_amount

		if (resolvedAmount === "0") return null

		const exchangeRate = $derived(resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		})
		const [ isNegative, shownAmount ] = makeCleanShownAmount(
			precisionFormats,
			currencies,
			exchangeRate,
			statementCurrency,
			viewedCurrency,
			resolvedAmount
		)
		const shouldDebitResolvedAmount = (
			isAccountNormallyDebited
			&& !isNegative
		) || (
			!isAccountNormallyDebited
			&& isNegative
		)

		return {
			account,
			"debitAmount": shouldDebitResolvedAmount ? shownAmount : "",
			"creditAmount": shouldDebitResolvedAmount ? "" : shownAmount
		} as SimplifiedSummaryCalculation
	}
).filter<SimplifiedSummaryCalculation>(calculation => !!calculation).sort((left, right) => {
	const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[left.account.kind]
	const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[right.account.kind]
	if (leftAccountKindImportance < rightAccountKindImportance) return -1
	if (leftAccountKindImportance > rightAccountKindImportance) return 1

	const leftAccountName = left.account.name
	const rightAccountName = right.account.name
	const lastName = leftAccountName.split(" ")[leftAccountName.split(" ").length - 1]
	const rightLastName = rightAccountName.split(" ")[rightAccountName.split(" ").length - 1]
	const lastNameComparison = lastName.localeCompare(rightLastName)

	return lastNameComparison !== 0
		? lastNameComparison
		: left.account.name.localeCompare(right.account.name)
}))
let allowedRealUnadjustedSummaryCalculations = $derived(realUnadjustedSummaryCalculations.map(
	calculation => {
		const frozenAccountIndex = allowedFrozenAccounts.findIndex(
			account => account.hash === calculation.frozen_account_hash
		)

		if (frozenAccountIndex === -1) return null

		const frozenAccount = allowedFrozenAccounts[frozenAccountIndex]
		const accountIndex = allowedAccounts.findIndex(
			account => account.id === frozenAccount.account_id
		)

		if (accountIndex === -1) return null

		const account = allowedAccounts[accountIndex]

		const isAccountNormallyDebited = normalDebitAccountKinds.indexOf(account.kind) > -1
		const resolvedAmount = subtractAmount(
			isAccountNormallyDebited
				? calculation.debit_amount
				: calculation.credit_amount,
			isAccountNormallyDebited
				? calculation.credit_amount
				: calculation.debit_amount
		)

		if (resolvedAmount === "0") return null

		const exchangeRate = $derived(resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		})
		const [ isNegative, shownAmount ] = makeCleanShownAmount(
			precisionFormats,
			currencies,
			exchangeRate,
			statementCurrency,
			viewedCurrency,
			resolvedAmount
		)
		const shouldDebitResolvedAmount = (
			isAccountNormallyDebited
			&& !isNegative
		) || (
			!isAccountNormallyDebited
			&& isNegative
		)

		return {
			account,
			"debitAmount": shouldDebitResolvedAmount ? shownAmount : "",
			"creditAmount": shouldDebitResolvedAmount ? "" : shownAmount
		} as SimplifiedSummaryCalculation
	}
).filter<SimplifiedSummaryCalculation>(calculation => !!calculation).sort((left, right) => {
	const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[left.account.kind]
	const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[right.account.kind]
	if (leftAccountKindImportance < rightAccountKindImportance) return -1
	if (leftAccountKindImportance > rightAccountKindImportance) return 1

	const leftAccountName = left.account.name
	const rightAccountName = right.account.name
	const lastName = leftAccountName.split(" ")[leftAccountName.split(" ").length - 1]
	const rightLastName = rightAccountName.split(" ")[rightAccountName.split(" ").length - 1]
	const lastNameComparison = lastName.localeCompare(rightLastName)

	return lastNameComparison !== 0
		? lastNameComparison
		: left.account.name.localeCompare(right.account.name)
}))
let allowedRealFlowCalculations = $derived(realFlowCalculations.map(
	calculation => {
		const frozenAccountIndex = allowedFrozenAccounts.findIndex(
			account => account.hash === calculation.frozen_account_hash
		)

		if (frozenAccountIndex === -1) return null

		const frozenAccount = allowedFrozenAccounts[frozenAccountIndex]
		const accountIndex = allowedAccounts.findIndex(
			account => account.id === frozenAccount.account_id
		)

		if (accountIndex === -1) return null

		const account = allowedAccounts[accountIndex]
		const cashFlowActivityIndex = cashFlowActivities.findIndex(
			cashFlowActivity => cashFlowActivity.id === calculation.cash_flow_activity_id
		)

		if (cashFlowActivityIndex === -1) return null
		const cashFlowActivity = cashFlowActivities[cashFlowActivityIndex]

		const exchangeRate = $derived(resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		})
		const shownAmount = makeShownAmount(
			precisionFormats,
			currencies,
			exchangeRate,
			statementCurrency,
			viewedCurrency,
			calculation.net_amount
		)

		return {
			cashFlowActivity,
			account,
			"amount": shownAmount
		} as SimplifiedFlowCalculation
	}
).filter<SimplifiedFlowCalculation>(calculation => !!calculation).sort((left, right) => {
	const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[left.account.kind]
	const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[right.account.kind]
	if (leftAccountKindImportance < rightAccountKindImportance) return -1
	if (leftAccountKindImportance > rightAccountKindImportance) return 1

	const leftAccountName = left.account.name
	const rightAccountName = right.account.name
	const lastName = leftAccountName.split(" ")[leftAccountName.split(" ").length - 1]
	const rightLastName = rightAccountName.split(" ")[rightAccountName.split(" ").length - 1]
	const lastNameComparison = lastName.localeCompare(rightLastName)

	return lastNameComparison !== 0
		? lastNameComparison
		: left.account.name.localeCompare(right.account.name)
}))
let allowedRealOpenedSummaryCalculations = $derived(realAdjustedSummaryCalculations.map(
	calculation => {
		const frozenAccountIndex = allowedFrozenAccounts.findIndex(
			account => account.hash === calculation.frozen_account_hash
		)

		if (frozenAccountIndex === -1) return null

		const frozenAccount = allowedFrozenAccounts[frozenAccountIndex]
		const accountIndex = allowedAccounts.findIndex(
			account => account.id === frozenAccount.account_id
		)

		if (accountIndex === -1) return null

		const account = allowedAccounts[accountIndex]
		const isAccountNormallyDebited = normalDebitAccountKinds.indexOf(account.kind) > -1
		const resolvedAmount = calculation.opened_amount

		if (resolvedAmount === "0") return null

		const exchangeRate = $derived(resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		})
		const [ isNegative, shownAmount ] = makeCleanShownAmount(
			precisionFormats,
			currencies,
			exchangeRate,
			statementCurrency,
			viewedCurrency,
			resolvedAmount
		)
		const shouldDebitResolvedAmount = (
			isAccountNormallyDebited
			&& !isNegative
		) || (
			!isAccountNormallyDebited
			&& isNegative
		)

		return {
			account,
			"debitAmount": shouldDebitResolvedAmount ? shownAmount : "",
			"creditAmount": shouldDebitResolvedAmount ? "" : shownAmount
		} as SimplifiedSummaryCalculation
	}
).filter<SimplifiedSummaryCalculation>(calculation => !!calculation))
let balancedSummaryCalculations = $derived(mergeUniqueElements(
	allowedRealUnadjustedSummaryCalculations,
	allowedRealOpenedSummaryCalculations, // Use opened summary calculation if unchanged
	calculation => calculation.account.id
).sort((left, right) => {
	const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[left.account.kind]
	const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[right.account.kind]
	if (leftAccountKindImportance < rightAccountKindImportance) return -1
	if (leftAccountKindImportance > rightAccountKindImportance) return 1

	const leftAccountName = left.account.name
	const rightAccountName = right.account.name
	const lastName = leftAccountName.split(" ")[leftAccountName.split(" ").length - 1]
	const rightLastName = rightAccountName.split(" ")[rightAccountName.split(" ").length - 1]
	const lastNameComparison = lastName.localeCompare(rightLastName)

	return lastNameComparison !== 0
		? lastNameComparison
		: left.account.name.localeCompare(right.account.name)
}))
let hasAcceptableCashFlowActivities = $derived(cashFlowActivities.length > 0)
</script>

<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<BalanceSheet
			{statement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			data={balancedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<IncomeStatement
			{statement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			data={allowedRealUnadjustedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="padder"/>
<GridCell kind="wide">
	<Flex direction="column" mustPad={false}>
		{#if hasAcceptableCashFlowActivities}
			<CashFlowStatement
				{statement}
				{statementExchangeRate}
				{statementCurrency}
				{viewedCurrency}
				{precisionFormats}
				{currencies}
				{emptyAmount}
				{cashFlowActivities}
				data={allowedRealFlowCalculations}/>
		{:else}
			<ElementalParagraph>
				Note: There are no accounts that belongs to cash flows activities. At least one account must belong to a cash flow activity.
			</ElementalParagraph>
		{/if}
	</Flex>
</GridCell>
<GridCell kind="padder"/>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="unadjusted"
			{statement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			data={allowedRealUnadjustedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="adjusted"
			{statement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			data={allowedRealAdjustedSummaryCalculations}/>
	</Flex>
</GridCell>
