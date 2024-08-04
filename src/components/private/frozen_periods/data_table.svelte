<script lang="ts">
	import type { FrozenPeriod } from "+/entity"

	import DataTable from "$/catalog/data_table.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import FrozenPeriodRecord from "%/frozen_periods/frozen_period_record.svelte"

	export let isConnecting: boolean
	export let data: FrozenPeriod[]
</script>

<DataTable collectiveName="Frozen Periods" {isConnecting} {data} progressRate={0}>
	<svelte:fragment slot="filled_collection_description">
		Below are the frozen periods that you have added on to your profile.
		Freezing certain periods is a feature to optimize the calculation of
		different accounts. It also serves as an artifact when reviewing the
		past financial statements.
	</svelte:fragment>
	<svelte:fragment slot="table_headers">
		<DataTableHeader>ID</DataTableHeader>
		<DataTableHeader>Start Date</DataTableHeader>
		<DataTableHeader>Finish Date</DataTableHeader>
		<DataTableHeader>Actions</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each data as entity(entity.id)}
			<FrozenPeriodRecord
				bind:data={entity}
				on:delete
				on:check/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available frozen periods at the moment.
		Create a financial entry to view.
	</svelte:fragment>
</DataTable>
