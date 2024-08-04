<script lang="ts">
	import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		SummaryCalculation,
		FlowCalculation
	} from "+/entity"

	import transformCurrency from "$/form/choice_info_transformer/transform_currency"

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

	let selectedCurrencyID = ""
	$: {
		if (selectedCurrencyID === "" && currencies.length > 0) {
			selectedCurrencyID = `${currencies[0].id}`
		}
	}

	$: selectedStatement = statements.find(
		statement => `${statement.currency_id}` === selectedCurrencyID
	)

	$: targetExchangeRates = exchangeRates.filter(
		exchangeRate => `${exchangeRate.source.currency_id}` === selectedCurrencyID
	)

	$: data = [
		...summaryCalculations,
		...targetExchangeRates,
		...flowCalculations
	]
</script>

<CatalogBase collectiveName="Financial Statements" {isConnecting} {data} progressRate={0}>
	<TertiaryHeading slot="name">Financial Statements</TertiaryHeading>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial statements associated with
		<ChoiceListField
			fieldName="Currency"
			errorFieldName="currency_id"
			disabled={isConnecting}
			bind:value={selectedCurrencyID}
			rawChoices={currencies}
			choiceConverter={transformCurrency}
			errors={[]}/>
		from {startedAt} to {finishedAt}.
	</svelte:fragment>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
	<svelte:fragment slot="available_content">
		{#if selectedStatement}
			<Cluster
				statement={selectedStatement}
				exchangeRates={targetExchangeRates}
				{currencies}
				{cashFlowActivities}
				{accounts}
				{summaryCalculations}
				{flowCalculations}/>
		{/if}
	</svelte:fragment>
</CatalogBase>
