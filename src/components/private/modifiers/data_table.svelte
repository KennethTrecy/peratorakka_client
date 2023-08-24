<script lang="ts">
	import type { Currency, Account, Modifier } from "+/entity"

	import DataTable from "$/catalog/data_table.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRecordHeader from "$/catalog/data_table_record_headers.svelte"
	import ModifierRecord from "%/modifiers/modifier_record.svelte"

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Modifier[]
</script>

<DataTable collectiveName="Modifiers" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the modifiers that you have added on to your profile.
		They can be associated to account entries.
	</svelte:fragment>
	<DataTableRecordHeader slot="table_headers">
		<DataTableHeader>Action</DataTableHeader>
		<DataTableHeader>Kind</DataTableHeader>
		<DataTableHeader>Description</DataTableHeader>
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
