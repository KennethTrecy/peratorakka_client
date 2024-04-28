<script lang="ts">
	import type { Currency, Account, Modifier, FinancialEntry } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import DataTable from "$/catalog/data_table.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
	import FinancialEntryRecord from "%/financial_entries/financial_entry_record.svelte"
	import ListSpecifier from "%/financial_entries/list_specifier.svelte"

	export let isConnecting: boolean
	export let progressRate: number
	export let currencies: Currency[]
	export let accounts: Account[]
	export let modifiers: Modifier[]
	export let data: FinancialEntry[]

	export let beginDate: string
	export let endDate: string
	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder

	export let listError: GeneralError[]
</script>

<DataTable collectiveName="Financial Entries" {isConnecting} {progressRate} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial entries that you have added on to your profile.
		Entries should be frozen to prevent editing or deletion.
	</svelte:fragment>
	<ListSpecifier
		slot="list_specifier"
		bind:beginDate={beginDate}
		bind:endDate={endDate}
		bind:searchMode={searchMode}
		bind:sortCriterion={sortCriterion}
		bind:sortOrder={sortOrder}
		{isConnecting}
		{listError}/>
	<DataTableRecordHeader slot="table_headers">
		<DataTableHeader slot="leading_headers">Transacted Date</DataTableHeader>
		<svelte:fragment slot="trailing_headers">
			<DataTableHeader>Amounts</DataTableHeader>
			<DataTableHeader>Remarks</DataTableHeader>
		</svelte:fragment>
	</DataTableRecordHeader>
	<svelte:fragment slot="table_rows">
		{#each data as entity(entity.id)}
			<FinancialEntryRecord
				bind:data={entity}
				{currencies}
				{accounts}
				{modifiers}
				on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available financial entries at the moment.
		Create a financial entry to view.
	</svelte:fragment>
</DataTable>
