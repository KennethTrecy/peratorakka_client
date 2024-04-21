<script lang="ts">
	import DataTableRow from "$/catalog/data_table_row.svelte"
</script>

<div class="mdc-data-table">
	<div class="mdc-data-table__table-container">
		<table class="mdc-data-table__table" aria-label="Dessert calories">
			<thead>
				<tr class="mdc-data-table__header-row">
					<slot name="table_headers"/>
				</tr>
			</thead>
			<tbody class="mdc-data-table__content">
				<slot name="table_rows"/>
			</tbody>
			{#if $$slots.table_footer_cells}
				<tfoot>
					<DataTableRow>
						<slot name="table_footer_cells"/>
					</DataTableRow>
				</tfoot>
			{/if}
		</table>
	</div>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/data-table/data-table";

	@include data-table.theme-baseline;
	@include data-table.core-styles;

	.mdc-data-table {
		white-space: wrap;
	}
</style>
