<script lang="ts">
import { untrack, type Snippet } from "svelte"
import type {
	FinancialStatementGroup,
	ExchangeRateInfo,
	CompleteFrozenPeriodInfo,
	GeneralError
} from "+/rest"
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

import { onDestroy } from "svelte"

import { ANY_CURRENCY } from "#/component"

import { addAmount } from "!/index"

import convertAmount from "$/utility/convert_amount"
import deriveExchangeRate from "$/utility/derive_exchange_rate"
import transformCurrency from "$/form/choice_info_transformer/transform_currency"
import makeJSONRequester from "$/rest/make_json_requester"

import CatalogBase from "$/catalog/base.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import Cluster from "%/frozen_periods/financial_statements/cluster.svelte"
import TertiaryHeading from "$/typography/tertiary_heading.svelte"

let {
	isConnecting,
	errors,
	children
}: {
	isConnecting: boolean
	errors: GeneralError[]
	children: Snippet<[{
		financialStatementCluster: Snippet
		display: (completeFrozenPeriodInfo: CompleteFrozenPeriodInfo) => void
	}]>
} = $props()

let completeFrozenPeriodInfo = $state<CompleteFrozenPeriodInfo|null>(null)
let precisionFormats = $derived<PrecisionFormat[]>(
	completeFrozenPeriodInfo?.precision_formats ?? []
)
let currencies = $derived<Currency[]>(
	[...(completeFrozenPeriodInfo?.currencies ?? [])]
	.sort((a, b) => a.created_at.localeCompare(b.created_at))
)
let cashFlowActivities = $derived<CashFlowActivity[]>(
	completeFrozenPeriodInfo?.cash_flow_activities ?? []
)
let accounts = $derived<Account[]>(
	completeFrozenPeriodInfo?.accounts ?? []
)
let frozenAccounts = $derived<FrozenAccount[]>(
	completeFrozenPeriodInfo?.frozen_accounts ?? []
)
let realAdjustedSummaryCalculations = $derived<RealAdjustedSummaryCalculation[]>(
	completeFrozenPeriodInfo?.real_adjusted_summary_calculations ?? []
)
let realUnadjustedSummaryCalculations = $derived<RealUnadjustedSummaryCalculation[]>(
	completeFrozenPeriodInfo?.real_unadjusted_summary_calculations ?? []
)
let realFlowCalculations = $derived<RealFlowCalculation[]>(
	completeFrozenPeriodInfo?.real_flow_calculations ?? []
)
let statements = $derived<FinancialStatementGroup[]>(
	completeFrozenPeriodInfo !== null ? completeFrozenPeriodInfo["@meta"].statements
	: []
)
let exchangeRates = $derived<ExchangeRateInfo[]>(
	completeFrozenPeriodInfo !== null ? completeFrozenPeriodInfo["@meta"].exchange_rates : []
)

let startedAt = $derived(
	(completeFrozenPeriodInfo?.frozen_period.started_at ?? "----------")
	.slice(0, "YYYY-MM-DD".length)
)
let finishedAt = $derived(
	(completeFrozenPeriodInfo?.frozen_period.finished_at ?? "----------")
	.slice(0, "YYYY-MM-DD".length)
)

let selectedCurrencyID = $state(`${ANY_CURRENCY.id}`)
let targetCurrencyID = $state(`${ANY_CURRENCY.id}`)
let hasSelectedFirstCurrencyAfterLoading = $state(false)
let IDPrefix = $derived(`date_${startedAt}_to_${finishedAt}`)
$effect(() => {
	if (
		currencies.length > 0
		&& selectedCurrencyID === `${ANY_CURRENCY.id}`
		&& !hasSelectedFirstCurrencyAfterLoading
	) {
		untrack(() => {
			selectedCurrencyID = `${currencies[0].id}`
			hasSelectedFirstCurrencyAfterLoading = true
		})
	}
})
$effect(() => {
	if (
		currencies.length > 0
		&& selectedCurrencyID === `${ANY_CURRENCY.id}`
		&& hasSelectedFirstCurrencyAfterLoading
	) {
		untrack(() => {
			targetCurrencyID = `${currencies[0].id}`
		})
	} else {
		untrack(() => {
			targetCurrencyID = selectedCurrencyID
		})
	}
})

let hasGoodDependencies = $derived(
	statements.length > 0
	|| exchangeRates.length > 0
	|| currencies.length > 0
	|| cashFlowActivities.length > 0
	|| accounts.length > 0
	|| frozenAccounts.length > 0
	|| realAdjustedSummaryCalculations.length > 0
	|| realUnadjustedSummaryCalculations.length > 0
	|| realFlowCalculations.length > 0
)
let viewedCurrency = $derived(currencies.find(
	currency => `${currency.id}` === targetCurrencyID
) ?? currencies[0] ?? ANY_CURRENCY)

let availableCurrencies = $derived([
	...currencies,
	ANY_CURRENCY
])

let resolvedExchangeRates = $derived<Record<string, ExchangeRateInfo>>(currencies.reduce(
	(previousRates, currency) => {
		const exchangeRate = deriveExchangeRate(currency, viewedCurrency, exchangeRates)
		const sourceKey = `${currency.id}`

		return {
			...previousRates,
			[sourceKey]: exchangeRate ?? {
				"source": {
					"currency_id": currency.id,
					"value": "1"
				},
				"destination": {
					"currency_id": currency.id,
					"value": "0"
				},
				"updated_at": (new Date()).toDateString()
			}
		}
	},
	{}
))

let selectedStatement: FinancialStatementGroup|null = $state(null)
const {
	"isConnecting": isConnectingForRecalculation,
	"errors": errorsForRecalculation,
	"send": requestForRecalculation
} = makeJSONRequester({
	"path": "/api/v2/frozen_periods/recalculate",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				const responseDocument = await response.json()
				const newStatement = responseDocument["@meta"].statement
				selectedStatement = {
					...newStatement,
					"currency_id": ANY_CURRENCY.id
				}
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

let isConnectingToRecalculate = $state(false)
onDestroy(isConnectingForRecalculation.subscribe(value => {
	isConnectingToRecalculate = value
}))
$effect(() => {
	if (!isConnectingToRecalculate) {
		try {
			const isAnyCurrencySelected = (
				statements.length > 0
				&& selectedCurrencyID === `${ANY_CURRENCY.id}`
			)
			const resolvedSelectedStatement = isAnyCurrencySelected
				? untrack(() => statements.reduce((compiledGroup, currentGroup) => {
					const exchangeRate = resolvedExchangeRates[`${currentGroup.currency_id}`]

					const compiledSubtotals = compiledGroup.cash_flow_statement.subtotals

					for (const currentSubtotal of currentGroup.cash_flow_statement.subtotals) {
						let hasFoundSubtotal = false
						for (const compiledSubtotal of compiledSubtotals) {
							if (
								compiledSubtotal.cash_flow_activity_id
									=== currentSubtotal.cash_flow_activity_id
							) {
								hasFoundSubtotal = true
								compiledSubtotal.net_income = addAmount(
									compiledSubtotal.net_income,
									convertAmount(currentSubtotal.net_income, exchangeRate)
								)
								compiledSubtotal.subtotal = addAmount(
									compiledSubtotal.subtotal,
									convertAmount(currentSubtotal.subtotal, exchangeRate)
								)
							}
						}

						if (!hasFoundSubtotal) {
							compiledSubtotals.push(currentSubtotal)
						}
					}

					const newStatement = {
						"currency_id": compiledGroup.currency_id,
						"unadjusted_trial_balance": {
							"debit_total": addAmount(
								compiledGroup.unadjusted_trial_balance.debit_total,
								convertAmount(
									currentGroup.unadjusted_trial_balance.debit_total,
									exchangeRate
								)
							),
							"credit_total": addAmount(
								compiledGroup.unadjusted_trial_balance.credit_total,
								convertAmount(
									currentGroup.unadjusted_trial_balance.credit_total,
									exchangeRate
								)
							)
						},
						"income_statement": {
							"net_total": addAmount(
								compiledGroup.income_statement.net_total,
								convertAmount(currentGroup.income_statement.net_total, exchangeRate)
							)
						},
						"balance_sheet": {
							"total_assets": addAmount(
								compiledGroup.balance_sheet.total_assets,
								convertAmount(currentGroup.balance_sheet.total_assets, exchangeRate)
							),
							"total_liabilities": addAmount(
								compiledGroup.balance_sheet.total_liabilities,
								convertAmount(currentGroup.balance_sheet.total_liabilities, exchangeRate)
							),
							"total_equities": addAmount(
								compiledGroup.balance_sheet.total_equities,
								convertAmount(currentGroup.balance_sheet.total_equities, exchangeRate)
							)
						},
						"cash_flow_statement": {
							"opened_real_liquid_amount": addAmount(
								compiledGroup.cash_flow_statement.opened_real_liquid_amount,
								convertAmount(
									currentGroup.cash_flow_statement.opened_real_liquid_amount,
									exchangeRate
								)
							),
							"closed_real_liquid_amount": addAmount(
								compiledGroup.cash_flow_statement.closed_real_liquid_amount,
								convertAmount(
									currentGroup.cash_flow_statement.closed_real_liquid_amount,
									exchangeRate
								)
							),
							"real_liquid_amount_difference": addAmount(
								compiledGroup.cash_flow_statement.real_liquid_amount_difference,
								convertAmount(
									currentGroup.cash_flow_statement.real_liquid_amount_difference,
									exchangeRate
								)
							),
							"subtotals": compiledSubtotals
						},
						"adjusted_trial_balance": {
							"debit_total": addAmount(
								compiledGroup.adjusted_trial_balance.debit_total,
								convertAmount(
									currentGroup.adjusted_trial_balance.debit_total,
									exchangeRate
								)
							),
							"credit_total": addAmount(
								compiledGroup.adjusted_trial_balance.credit_total,
								convertAmount(
									currentGroup.adjusted_trial_balance.credit_total,
									exchangeRate
								)
							)
						}
					}

					return newStatement
				}, {
					"currency_id": +selectedCurrencyID,
					"unadjusted_trial_balance": {
						"debit_total": "0",
						"credit_total": "0"
					},
					"income_statement": {
						"net_total": "0"
					},
					"balance_sheet": {
						"total_assets": "0",
						"total_liabilities": "0",
						"total_equities": "0"
					},
					"cash_flow_statement": {
						"opened_real_liquid_amount": "0",
						"closed_real_liquid_amount": "0",
						"real_liquid_amount_difference": "0",
						"subtotals": []
					},
					"adjusted_trial_balance": {
						"debit_total": "0",
						"credit_total": "0"
					}
				} as FinancialStatementGroup))
				: statements.find(
					statement => `${statement.currency_id}` === selectedCurrencyID
				) ?? null
			untrack(() => {
				selectedStatement = resolvedSelectedStatement
			})
		} catch (e) {
			untrack(() => {
				selectedStatement = null

				requestForRecalculation({
					"body": JSON.stringify({
						"frozen_period": {
							"started_at": `${startedAt} 00:00:00`,
							"finished_at": `${finishedAt} 11:59:59`,
							"source_currency_id": `${ANY_CURRENCY.id}` ? null : +selectedCurrencyID,
							"target_currency_id": viewedCurrency.id
						}
					})
				})
			})
		}
	}
})

let data = $derived([
	selectedStatement,
	...frozenAccounts,
	...realAdjustedSummaryCalculations,
	...realUnadjustedSummaryCalculations,
	...realFlowCalculations
].filter(data => data !== null))

function display(newCompleteFrozenPeriodInfo: CompleteFrozenPeriodInfo) {
	completeFrozenPeriodInfo = newCompleteFrozenPeriodInfo
}

// TODO: Show errors
</script>

{#snippet financialStatementCluster()}
	<CatalogBase
		collectiveName="Financial Statements"
		isConnecting={isConnecting || $isConnectingForRecalculation}
		{data}
		progressRate={0}>
		{#snippet name()}
			<TertiaryHeading>Financial Statements</TertiaryHeading>
		{/snippet}
		{#snippet filled_collection_description()}
			{#if hasGoodDependencies && selectedStatement}
				Below are the financial statements associated from {startedAt} to {finishedAt}.
				<ChoiceListField
					fieldName="Origin Currency"
					errorFieldID="currency_id"
					disabled={isConnecting}
					bind:value={selectedCurrencyID}
					rawChoices={availableCurrencies}
					choiceConverter={transformCurrency}
					{IDPrefix}
					errors={[]}/>
				<ChoiceListField
					fieldName="Viewed Currency"
					errorFieldID="currency_id"
					disabled={false}
					bind:value={targetCurrencyID}
					rawChoices={currencies}
					choiceConverter={transformCurrency}
					{IDPrefix}
					errors={[]}/>
			{/if}
		{/snippet}
		{#snippet empty_collection_description()}
			There are no financial statements at the chosen date range. Please check another range.
		{/snippet}
		{#snippet available_content()}
			{#if hasGoodDependencies && selectedStatement}
				<Cluster
					{viewedCurrency}
					statement={selectedStatement}
					{resolvedExchangeRates}
					{precisionFormats}
					{currencies}
					{cashFlowActivities}
					{accounts}
					{frozenAccounts}
					{realAdjustedSummaryCalculations}
					{realUnadjustedSummaryCalculations}
					{realFlowCalculations}/>
			{/if}
		{/snippet}
	</CatalogBase>
{/snippet}

{@render children({ financialStatementCluster, display })}
