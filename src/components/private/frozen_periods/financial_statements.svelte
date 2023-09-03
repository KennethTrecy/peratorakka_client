<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type { Currency, Account, SummaryCalculation } from "+/entity"

	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import TertiaryHeading from "$/typography/tertiary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnnamedDataTable from "$/catalog/unnamed_data_table.svelte"

	export let isConnecting: boolean

	export let startedAt: string
	export let finishedAt: string
	export let statements: FinancialStatementGroup[]
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]
</script>

<UnnamedDataTable collectiveName="Unadjusted trial balances" {isConnecting} {data}>
	<TertiaryHeading slot="name">Unadjusted Trial Balances</TertiaryHeading>
	<svelte:fragment slot="filled_collection_description">
		Below are the unadjusted balances of different accounts from {startedAt} to {finishedAt}.
	</svelte:fragment>
	<svelte:fragment slot="table_headers">
		<DataTableHeader>Account</DataTableHeader>
		<DataTableHeader>Debit Amount</DataTableHeader>
		<DataTableHeader>Credit Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each data as calculation(calculation.account_id)}
			<TrialRow
				{currencies}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no unadjusted trial balances at the moment. Create or check frozen period to see.
	</svelte:fragment>
</UnnamedDataTable>
