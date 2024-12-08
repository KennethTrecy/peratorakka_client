<script lang="ts">
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type {
	Currency,
	CashFlowActivity,
	Account,
	SummaryCalculation,
	FlowCalculation
} from "+/entity"

import { get } from "svelte/store"

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

export let isConnecting: boolean

export let startedAt: string
export let finishedAt: string
export let statements: FinancialStatementGroup[]
export let exchangeRates: ExchangeRateInfo[]
export let currencies: Currency[]
export let cashFlowActivities: CashFlowActivity[]
export let accounts: Account[]
export let summaryCalculations: Omit<SummaryCalculation, "frozen_period_id">[]
export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

let selectedCurrencyID = `${ANY_CURRENCY.id}`
let previousSelectedCurrencyID = `${ANY_CURRENCY.id}`
let targetCurrencyID = `${ANY_CURRENCY.id}`
let hasSelectedFirstCurrencyAfterLoading = false
$: {
	if (currencies.length > 0) {
		if (selectedCurrencyID === `${ANY_CURRENCY.id}` && !hasSelectedFirstCurrencyAfterLoading) {
			selectedCurrencyID = `${currencies[0].id}`
			hasSelectedFirstCurrencyAfterLoading = true
		}

		if (previousSelectedCurrencyID !== selectedCurrencyID) {
			previousSelectedCurrencyID = selectedCurrencyID
			if (selectedCurrencyID === `${ANY_CURRENCY.id}`) {
				targetCurrencyID = `${currencies[0].id}`
			} else {
				targetCurrencyID = selectedCurrencyID
			}
		}
	}
}

$: hasGoodDependencies = statements.length > 0
	|| exchangeRates.length > 0
	|| currencies.length > 0
	|| cashFlowActivities.length > 0
	|| accounts.length > 0
	|| summaryCalculations.length > 0
	|| flowCalculations.length > 0
$: viewedCurrency = currencies.find(
	currency => `${currency.id}` === targetCurrencyID
) ?? currencies[0] ?? ANY_CURRENCY

$: availableCurrencies = [
	...currencies,
	ANY_CURRENCY
]

let selectedStatement: FinancialStatementGroup|null = null

const {
	"isConnecting": isConnectingForRecalculation,
	"errors": errorsForRecalculation,
	"send": requestForRecalculation
} = makeJSONRequester({
	"path": "/api/v1/frozen_periods/recalculate",
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

$: {
	if (!get(isConnectingForRecalculation)) {
		try {
			selectedStatement = statements.length > 0 && selectedCurrencyID === `${ANY_CURRENCY.id}`
				? statements.reduce((compiledGroup, currentGroup) => {
					const currentCurrency = currencies.find(
						currency => currency.id === currentGroup.currency_id
					) ?? ANY_CURRENCY
					const exchangeRate = viewedCurrency.id === ANY_CURRENCY.id
						? {
							"source": {
								"currency_id": currentGroup.currency_id ?? 0,
								"value": "1"
							},
							"destination": {
								"currency_id": compiledGroup.currency_id ?? 0,
								"value": "0"
							},
							"updated_at": (new Date()).toDateString()
						}
						: deriveExchangeRate(currentCurrency, viewedCurrency, exchangeRates)

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
								convertAmount(currentGroup.unadjusted_trial_balance.debit_total, exchangeRate)
							),
							"credit_total": addAmount(
								compiledGroup.unadjusted_trial_balance.credit_total,
								convertAmount(currentGroup.unadjusted_trial_balance.credit_total, exchangeRate)
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
							"opened_liquid_amount": addAmount(
								compiledGroup.cash_flow_statement.opened_liquid_amount,
								convertAmount(currentGroup.cash_flow_statement.opened_liquid_amount, exchangeRate)
							),
							"closed_liquid_amount": addAmount(
								compiledGroup.cash_flow_statement.closed_liquid_amount,
								convertAmount(currentGroup.cash_flow_statement.closed_liquid_amount, exchangeRate)
							),
							"liquid_amount_difference": addAmount(
								compiledGroup.cash_flow_statement.liquid_amount_difference,
								convertAmount(
									currentGroup.cash_flow_statement.liquid_amount_difference,
									exchangeRate
								)
							),
							"subtotals": compiledSubtotals
						},
						"adjusted_trial_balance": {
							"debit_total": addAmount(
								compiledGroup.adjusted_trial_balance.debit_total,
								convertAmount(currentGroup.adjusted_trial_balance.debit_total, exchangeRate)
							),
							"credit_total": addAmount(
								compiledGroup.adjusted_trial_balance.credit_total,
								convertAmount(currentGroup.adjusted_trial_balance.credit_total, exchangeRate)
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
						"opened_liquid_amount": "0",
						"closed_liquid_amount": "0",
						"liquid_amount_difference": "0",
						"subtotals": []
					},
					"adjusted_trial_balance": {
						"debit_total": "0",
						"credit_total": "0"
					}
				} as FinancialStatementGroup)
				: statements.find(
					statement => `${statement.currency_id}` === selectedCurrencyID
				) ?? null
		} catch (e) {
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
		}
	}
}

$: data = [
	selectedStatement,
	...summaryCalculations,
	...exchangeRates,
	...flowCalculations
].filter(data => data !== null)
</script>

<CatalogBase
	collectiveName="Financial Statements"
	isConnecting={isConnecting || $isConnectingForRecalculation}
	{data}
	progressRate={0}>
	<TertiaryHeading slot="name">Financial Statements</TertiaryHeading>
	<svelte:fragment slot="filled_collection_description">
		{#if hasGoodDependencies && selectedStatement}
		Below are the financial statements associated from {startedAt} to {finishedAt}.
			<ChoiceListField
				fieldName="Origin Currency"
				errorFieldID="currency_id"
				disabled={isConnecting}
				bind:value={selectedCurrencyID}
				rawChoices={availableCurrencies}
				choiceConverter={transformCurrency}
				errors={[]}/>
			<ChoiceListField
				fieldName="Viewed Currency"
				errorFieldID="currency_id"
				disabled={false}
				bind:value={targetCurrencyID}
				rawChoices={currencies}
				choiceConverter={transformCurrency}
				errors={[]}/>
		{/if}
	</svelte:fragment>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
	<svelte:fragment slot="available_content">
		{#if hasGoodDependencies && selectedStatement}
			<Cluster
				{viewedCurrency}
				statement={selectedStatement}
				{exchangeRates}
				{currencies}
				{cashFlowActivities}
				{accounts}
				{summaryCalculations}
				{flowCalculations}/>
		{/if}
	</svelte:fragment>
</CatalogBase>
