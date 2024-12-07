<script lang="ts">
import type { Currency, CashFlowActivity, Account, Modifier, FinancialEntry } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import DataTable from "$/catalog/data_table.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
import FinancialEntryRecord from "%/financial_entries/financial_entry_record.svelte"
import ListSpecifier from "%/financial_entries/list_specifier.svelte"

export let isConnecting: boolean
export let progressRate: number
export let currencies: Currency[]
export let cashFlowActivities: CashFlowActivity[]
export let accounts: Account[]
export let modifiers: Modifier[]
export let data: FinancialEntry[]

export let selectedAccountID: string
export let selectedModifierID: string
export let beginDate: string
export let endDate: string
export let searchMode: SearchMode
export let sortCriterion: string
export let sortOrder: SortOrder

export let listErrors: GeneralError[]

$: isPresentAndArchived = searchMode === "with_deleted"
$: isPresent = searchMode === "normal" || isPresentAndArchived
$: isArchived = searchMode === "only_deleted" || isPresentAndArchived
</script>

<DataTable collectiveName="Financial Entries" {isConnecting} {progressRate} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial entries that you have added on to your profile.
		Entries should be frozen to prevent editing or deletion.
	</svelte:fragment>
	<ListSpecifier
		slot="list_specifier"
		{currencies}
		{accounts}
		{modifiers}
		bind:beginDate={beginDate}
		bind:endDate={endDate}
		bind:selectedAccountID={selectedAccountID}
		bind:selectedModifierID={selectedModifierID}
		bind:searchMode={searchMode}
		bind:sortCriterion={sortCriterion}
		bind:sortOrder={sortOrder}
		{isConnecting}
		{listErrors}/>
	<DataTableRecordHeader slot="table_headers" actionCellLabel="Remarks and Available Actions">
		<DataTableHeader slot="leading_headers">Transacted Date</DataTableHeader>
		<svelte:fragment slot="trailing_headers">
			<DataTableHeader scope="column">Involved Accounts</DataTableHeader>
			<DataTableHeader scope="column">Debited/Credited<br/>Amounts</DataTableHeader>
		</svelte:fragment>
	</DataTableRecordHeader>
	<svelte:fragment slot="table_rows">
		{#each data as entity(entity.id)}
			<FinancialEntryRecord
				bind:data={entity}
				{currencies}
				{cashFlowActivities}
				{accounts}
				{modifiers}
				on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available financial entries at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a financial entry to view.
	</svelte:fragment>
</DataTable>
