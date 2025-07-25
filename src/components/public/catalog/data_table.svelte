<script lang="ts">
import CatalogBase from "$/catalog/base.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

	interface Props {
		isConnecting: boolean
		progressRate: number
		collectiveName: string
		data: unknown[];
		filled_collection_description?: Snippet
		empty_collection_description?: Snippet
		list_specifier?: Snippet
		table_footer_cells?: Snippet
		table_headers?: Snippet
		table_rows?: Snippet
	}

	let {
		isConnecting,
		progressRate,
		collectiveName,
		data,
		filled_collection_description,
		empty_collection_description,
		list_specifier,
		table_footer_cells,
		table_headers,
		table_rows
	}: Props = $props()

	const filled_collection_description_render = $derived(filled_collection_description);
	const empty_collection_description_render = $derived(empty_collection_description);
	const table_headers_render = $derived(table_headers);
	const table_rows_render = $derived(table_rows);
	const table_footer_cells_render = $derived(table_footer_cells);
</script>

<CatalogBase
	{isConnecting}
	{progressRate}
	{collectiveName}
	{data}>
	{#snippet name()}
		<SecondaryHeading >Available {collectiveName}</SecondaryHeading>
	{/snippet}
	{#snippet filled_collection_description()}
		{@render filled_collection_description_render?.()}
	{/snippet}
	{#snippet empty_collection_description()}
		{@render empty_collection_description_render?.()}
	{/snippet}
	{#snippet bare_list_specifier()}

			{#if list_specifier}
				<GridCell kind="full">
					<Flex direction="row" justifyContent="responsive_stretch" mustPad={false}>
						{@render list_specifier?.()}
					</Flex>
				</GridCell>
			{/if}

	{/snippet}
	{#snippet available_content()}
		<GridCell  kind="full">
			<Flex direction="column" mustPad={false}>
				{#if table_footer_cells}
					<UnitDataTable>
						{#snippet table_headers()}
										{@render table_headers_render?.()}
									{/snippet}
						{#snippet table_rows()}
										{@render table_rows_render?.()}
									{/snippet}
						{#snippet table_footer_cells()}
										{@render table_footer_cells_render?.()}
									{/snippet}
					</UnitDataTable>
				{:else}
					<UnitDataTable>
						{#snippet table_headers()}
										{@render table_headers_render?.()}
									{/snippet}
						{#snippet table_rows()}
										{@render table_rows_render?.()}
									{/snippet}
					</UnitDataTable>
				{/if}
			</Flex>
		</GridCell>
	{/snippet}
</CatalogBase>
