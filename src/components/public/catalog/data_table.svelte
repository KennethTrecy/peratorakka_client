<script lang="ts">
	import CatalogBase from "$/catalog/base.svelte"
	import Flex from "$/layout/flex.svelte"
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
	<svelte:fragment slot="bare_list_specifier">
		{#if $$slots.list_specifier}
			<GridCell kind="full">
				<Flex direction="column" mustPad={false}>
					<Flex direction="row" mustPad={false}>
						<slot name="list_specifier"/>
					</Flex>
				</Flex>
			</GridCell>
		{/if}
	</svelte:fragment>
	<GridCell slot="available_content" kind="full">
		<Flex direction="column" mustPad={false}>
			{#if $$slots.table_footer_cells}
				<UnitDataTable>
					<slot slot="table_headers" name="table_headers"/>
					<slot slot="table_rows" name="table_rows"/>
					<slot slot="table_footer_cells" name="table_footer_cells"/>
				</UnitDataTable>
			{:else}
				<UnitDataTable>
					<slot slot="table_headers" name="table_headers"/>
					<slot slot="table_rows" name="table_rows"/>
				</UnitDataTable>
			{/if}
		</Flex>
	</GridCell>
</CatalogBase>
