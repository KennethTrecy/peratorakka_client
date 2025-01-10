<script lang="ts">
	import DataTableRow from "$/catalog/data_table_row.svelte"
</script>

<table class="body-normal">
	<thead>
		<DataTableRow>
			<slot name="table_headers"/>
		</DataTableRow>
	</thead>
	<tbody>
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

<style lang="scss">
@use "@/components/third-party/index";

table {
	white-space: wrap;
	max-width: 100%;
}
</style>
