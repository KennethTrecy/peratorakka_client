<script lang="ts">
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type {
	CensoredAccount,
	SimplifiedSummaryCalculation,
	SimplifiedFlowCalculation,
	SimplifiedItemCalculation
} from "+/component"
import type {
	PrecisionFormat,
	Currency,
	ItemDetail,
	CashFlowActivity,
	Account,
	ItemConfiguration,
	FrozenAccount,
	RealAdjustedSummaryCalculation,
	RealUnadjustedSummaryCalculation,
	RealFlowCalculation,
	ItemCalculation
} from "+/entity"

import { ANY_CURRENCY } from "#/component"
import { ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY, normalDebitAccountKinds } from "#/entity"

import { addAmount, subtractAmount } from "!/index"
import censorFlowCalculations from "%/frozen_periods/financial_statements/censor_flow_calculations"
import censorItemCalculations from "%/frozen_periods/financial_statements/censor_item_calculations"
import censorStatementGroup from "%/frozen_periods/financial_statements/censor_statement_group"
import censorSummaryCalculations
	from "%/frozen_periods/financial_statements/censor_summary_calculations"
import formatQuantity from "$/utility/format_quantity"
import makeShownAmount from "$/utility/make_shown_amount"
import makeCleanShownAmount from "$/utility/make_clean_shown_amount"
import mergeUniqueElements from "$/utility/merge_unique_elements"

import BalanceSheet from "%/frozen_periods/financial_statements/balance_sheet.svelte"
import CashFlowStatement from "%/frozen_periods/financial_statements/cash_flow_statement.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import IncomeStatement from "%/frozen_periods/financial_statements/income_statement.svelte"
import Inventory from "%/frozen_periods/financial_statements/inventory.svelte"
import TrialBalance from "%/frozen_periods/financial_statements/trial_balance.svelte"

let {
	viewedCurrency,
	statement,
	resolvedExchangeRates,
	precisionFormats,
	currencies,
	itemDetails,
	cashFlowActivities,
	censoredAccounts,
	accounts,
	itemConfigurations,
	frozenAccounts,
	realAdjustedSummaryCalculations,
	realUnadjustedSummaryCalculations,
	realFlowCalculations,
	itemCalculations
}: {
	viewedCurrency: Currency
	statement: FinancialStatementGroup
	resolvedExchangeRates: Record<string, ExchangeRateInfo>
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	itemDetails: ItemDetail[]
	cashFlowActivities: CashFlowActivity[]
	censoredAccounts: CensoredAccount[]
	accounts: Account[]
	itemConfigurations: ItemConfiguration[]
	frozenAccounts: FrozenAccount[]
	realAdjustedSummaryCalculations: RealAdjustedSummaryCalculation[]
	realUnadjustedSummaryCalculations: RealUnadjustedSummaryCalculation[]
	realFlowCalculations: RealFlowCalculation[]
	itemCalculations: ItemCalculation[]
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
let allowedRealAdjustedSummaryCalculations = $derived(censorSummaryCalculations(
	censoredAccounts,
	realAdjustedSummaryCalculations.map(calculation => {
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

		const exchangeRate = resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		}
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
	})
	.filter<SimplifiedSummaryCalculation>(calculation => !!calculation)
	.sort((left, right) => sortAccounts(left.account, right.account))
))
let allowedRealUnadjustedSummaryCalculations = $derived(censorSummaryCalculations(
	censoredAccounts,
	realUnadjustedSummaryCalculations.map(calculation => {
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

		const exchangeRate = resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		}
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
	})
	.filter<SimplifiedSummaryCalculation>(calculation => !!calculation)
	.sort((left, right) => sortAccounts(left.account, right.account))
))
let allowedUncensoredRealFlowCalculations = $derived(realFlowCalculations.map(
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

		const exchangeRate = resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		}
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
).filter<SimplifiedFlowCalculation>(calculation => !!calculation)
.sort((left, right) => sortAccounts(left.account, right.account)))
let allowedRealFlowCalculations = $derived(censorFlowCalculations(
	censoredAccounts,
	allowedUncensoredRealFlowCalculations
))
let allowedItemCalculations = $derived(censorItemCalculations(
	censoredAccounts,
	itemCalculations.map(calculation => {
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

		return {
			account,
			"totalRemainingCost": calculation.remaining_cost,
			"totalRemainingQuantity": calculation.remaining_quantity
		} as SimplifiedItemCalculation
	})
	.filter<SimplifiedItemCalculation>(calculation => !!calculation)
	.reduce((summarizedItemCalculations, currentItemCalculation) => {
		const index = summarizedItemCalculations.findIndex(summarizedItemCalculation => {
			return summarizedItemCalculation.account.id === currentItemCalculation.account.id
		})

		if (index === -1) {
			return [
				...summarizedItemCalculations,
				currentItemCalculation
			]
		} else {
			const newCalculation = summarizedItemCalculations[index]
			newCalculation.totalRemainingCost = addAmount(
				newCalculation.totalRemainingCost,
				currentItemCalculation.totalRemainingCost
			)
			newCalculation.totalRemainingQuantity = addAmount(
				newCalculation.totalRemainingQuantity,
				currentItemCalculation.totalRemainingQuantity
			)
			summarizedItemCalculations[index] = newCalculation
		}

		return summarizedItemCalculations
	}, [] as SimplifiedItemCalculation[])
	.map(calculation => {
		const account = calculation.account

		const itemConfigurationIndex = itemConfigurations.findIndex(itemConfiguration => {
			return itemConfiguration.account_id === account.id
		})

		if (itemConfigurationIndex === -1) return null

		const itemConfiguration = itemConfigurations[itemConfigurationIndex]

		const shownItemDetail = itemDetails.find(
			itemDetail => itemDetail.id === itemConfiguration.item_detail_id
		)

		const quantityPrecisionFormat = precisionFormats.find(
			precisionFormat => precisionFormat.id === shownItemDetail?.precision_format_id
		)

		const exchangeRate = resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		}
		const shownAmount = makeShownAmount(
			precisionFormats,
			currencies,
			exchangeRate,
			statementCurrency,
			viewedCurrency,
			calculation.totalRemainingCost
		)

		const shownQuantity = formatQuantity(
			quantityPrecisionFormat,
			shownItemDetail,
			calculation.totalRemainingQuantity
		)

		return {
			account,
			"totalRemainingCost": shownAmount,
			"totalRemainingQuantity": shownQuantity
		} as SimplifiedItemCalculation
	})
	.filter<SimplifiedItemCalculation>(calculation => !!calculation)
	.sort((left, right) => sortAccounts(left.account, right.account))
))
let allowedRealOpenedSummaryCalculations = $derived(censorSummaryCalculations(
	censoredAccounts,
	realAdjustedSummaryCalculations.map(calculation => {
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

		const exchangeRate = resolvedExchangeRates[account.currency_id] ?? {
			"source": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"destination": {
				"currency_id": account.currency_id,
				"value": "1"
			},
			"updated_at": (new Date()).toDateString()
		}
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
	})
	.filter<SimplifiedSummaryCalculation>(calculation => !!calculation)
))
let balancedSummaryCalculations = $derived(mergeUniqueElements(
	allowedRealUnadjustedSummaryCalculations,
	allowedRealOpenedSummaryCalculations, // Use opened summary calculation if unchanged
	calculation => calculation.account.id
).sort((left, right) => sortAccounts(left.account, right.account)))
let hasAcceptableCashFlowActivities = $derived(cashFlowActivities.length > 0)
let censoredStatement = $derived(censorStatementGroup(
	censoredAccounts,
	allowedUncensoredRealFlowCalculations,
	statement
))

function sortAccounts(left: Account, right: Account) {
	const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[left.kind]
	const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[right.kind]
	if (leftAccountKindImportance < rightAccountKindImportance) return -1
	if (leftAccountKindImportance > rightAccountKindImportance) return 1

	const leftAccountName = left.name
	const rightAccountName = right.name
	const lastName = leftAccountName.split(" ")[leftAccountName.split(" ").length - 1]
	const rightLastName = rightAccountName.split(" ")[rightAccountName.split(" ").length - 1]
	const lastNameComparison = lastName.localeCompare(rightLastName)

	return lastNameComparison !== 0
		? lastNameComparison
		: left.name.localeCompare(right.name)
}
</script>

<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<BalanceSheet
			statement={censoredStatement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			{emptyAmount}
			data={balancedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<IncomeStatement
			statement={censoredStatement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			data={allowedRealUnadjustedSummaryCalculations}/>
	</Flex>
</GridCell>
{#if allowedItemCalculations.length > 0}
	<GridCell kind="pair">
		<Flex direction="column" mustPad={false}>
			{#if hasAcceptableCashFlowActivities}
				<CashFlowStatement
					statement={censoredStatement}
					{statementExchangeRate}
					{statementCurrency}
					{viewedCurrency}
					{precisionFormats}
					{currencies}
					{cashFlowActivities}
					{emptyAmount}
					data={allowedRealFlowCalculations}/>
			{:else}
				<ElementalParagraph>
					Note: There are no accounts that belongs to cash flows activities. At least one account must belong to a cash flow activity.
				</ElementalParagraph>
			{/if}
		</Flex>
	</GridCell>
	<GridCell kind="pair">
		<Flex direction="column" mustPad={false}>
			<Inventory data={allowedItemCalculations}/>
		</Flex>
	</GridCell>
{:else}
	<GridCell kind="padder"/>
	<GridCell kind="wide">
		<Flex direction="column" mustPad={false}>
			{#if hasAcceptableCashFlowActivities}
				<CashFlowStatement
					statement={censoredStatement}
					{statementExchangeRate}
					{statementCurrency}
					{viewedCurrency}
					{precisionFormats}
					{currencies}
					{cashFlowActivities}
					{emptyAmount}
					data={allowedRealFlowCalculations}/>
			{:else}
				<ElementalParagraph>
					Note: There are no accounts that belongs to cash flows activities. At least one account must belong to a cash flow activity.
				</ElementalParagraph>
			{/if}
		</Flex>
	</GridCell>
	<GridCell kind="padder"/>
{/if}
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="unadjusted"
			statement={censoredStatement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			{emptyAmount}
			data={balancedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="adjusted"
			statement={censoredStatement}
			{statementExchangeRate}
			{statementCurrency}
			{viewedCurrency}
			{precisionFormats}
			{currencies}
			{emptyAmount}
			data={allowedRealAdjustedSummaryCalculations}/>
	</Flex>
</GridCell>
