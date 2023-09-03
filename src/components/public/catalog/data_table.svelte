<script lang="ts">
	import CatalogBase from "$/catalog/base.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]
</script>

<CatalogBase
	{isConnecting}
	{collectiveName}
	{data}>
	<SecondaryHeading slot="name">Available {collectiveName}</SecondaryHeading>
	<slot slot="filled_collection_description" name="filled_collection_description"/>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
	<GridCell slot="available_content" kind="full">
		<UnitDataTable>
			<slot slot="table_headers" name="table_headers"/>
			<slot slot="table_rows" name="table_rows"/>
			{#if $$slots.table_footer_cells}
				<slot name="table_footer_cells"/>
			{/if}
		</UnitDataTable>
	</GridCell>
</CatalogBase>
