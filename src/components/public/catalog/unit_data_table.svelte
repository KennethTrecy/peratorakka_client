<script lang="ts">
import type { Snippet } from "svelte"

import DataTableRow from "$/catalog/data_table_row.svelte"

let { table_headers, table_rows, table_footer_cells }: {
	table_headers: Snippet
	table_rows: Snippet
	table_footer_cells?: Snippet
} = $props()
</script>

<table class="body-normal">
	<thead>
		<DataTableRow>
			{@render table_headers?.()}
		</DataTableRow>
	</thead>
	<tbody>
		{@render table_rows?.()}
	</tbody>
	{#if table_footer_cells}
		<tfoot>
			<DataTableRow>
				{@render table_footer_cells?.()}
			</DataTableRow>
		</tfoot>
	{/if}
</table>

<style lang="scss">
table {
	white-space: wrap;
	max-width: 100%;
}
</style>
