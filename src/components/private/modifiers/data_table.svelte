<script lang="ts">
	import type { Currency, Account, Modifier } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import DataTable from "$/catalog/data_table.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"
	import ModifierRecord from "%/modifiers/modifier_record.svelte"

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Modifier[]

	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder

	export let listError: GeneralError[]

	const availableSortCriteria = [
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]
</script>

<DataTable collectiveName="Modifiers" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the modifiers that you have added on to your profile.
		They can be associated to account entries.
	</svelte:fragment>
	<ListSpecifier
		slot="list_specifier"
		bind:searchMode={searchMode}
		bind:sortCriterion={sortCriterion}
		bind:sortOrder={sortOrder}
		{isConnecting}
		{availableSortCriteria}
		errors={listError}/>
	<DataTableRecordHeader slot="table_headers">
		<svelte:fragment slot="trailing_headers">
			<DataTableHeader>Kind</DataTableHeader>
			<DataTableHeader>Financial Action</DataTableHeader>
			<DataTableHeader>Description</DataTableHeader>
		</svelte:fragment>
	</DataTableRecordHeader>
	<svelte:fragment slot="table_rows">
		{#each data as entity(entity.id)}
			<ModifierRecord
				bind:data={entity}
				{currencies}
				{accounts}
				on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available modifiers at the moment.
		Create a modifier to view.
	</svelte:fragment>
</DataTable>
