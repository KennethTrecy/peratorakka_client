<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type { Currency, Account, SummaryCalculation } from "+/entity"

	import CatalogBase from "$/catalog/base.svelte"
	import TertiaryHeading from "$/typography/tertiary_heading.svelte"
	import Cluster from "%/frozen_periods/financial_statements/cluster.svelte"

	export let isConnecting: boolean

	export let startedAt: string
	export let finishedAt: string
	export let statements: FinancialStatementGroup[]
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]
</script>

<CatalogBase collectiveName="Financial Statements" {isConnecting} {data}>
	<TertiaryHeading slot="name">Financial Statements</TertiaryHeading>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial statements of various currencies from {startedAt} to {finishedAt}.
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no financial statements at the moment. Create or check frozen period to see.
	</svelte:fragment>
	<svelte:fragment slot="available_content">
		{#each statements as statement(statement.currency_id)}
			<Cluster
				{statement}
				{currencies}
				{accounts}
				{data}/>
		{/each}
	</svelte:fragment>
</CatalogBase>
