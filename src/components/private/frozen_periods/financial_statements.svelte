<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type { Currency, Account, SummaryCalculation } from "+/entity"

	import transformCurrency from "$/form/choice_info_transformer/transform_currency"

	import CatalogBase from "$/catalog/base.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import Cluster from "%/frozen_periods/financial_statements/cluster.svelte"
	import TertiaryHeading from "$/typography/tertiary_heading.svelte"

	export let isConnecting: boolean

	export let startedAt: string
	export let finishedAt: string
	export let statements: FinancialStatementGroup[]
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	let selectedCurrencyID = ""
	$: {
		if (selectedCurrencyID === "" && currencies.length > 0) {
			selectedCurrencyID = `${currencies[0].id}`
		}
	}

	$: selectedStatement = statements.find(
		statement => `${statement.currency_id}` === selectedCurrencyID
	)
</script>

<CatalogBase collectiveName="Financial Statements" {isConnecting} {data}>
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
				{currencies}
				{accounts}
				{data}/>
		{/if}
	</svelte:fragment>
</CatalogBase>
