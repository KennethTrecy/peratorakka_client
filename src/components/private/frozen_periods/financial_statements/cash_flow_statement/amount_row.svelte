<script lang="ts">
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"

let {
	categoryName,
	categoryNameRowSpan,
	accountName,
	shownAmount,
	hasEmptyTrailingRow = false
}: {
	categoryName: string
	categoryNameRowSpan: number
	accountName: string
	shownAmount: string
	hasEmptyTrailingRow?: boolean
} = $props()

let mustSpan = $derived(categoryNameRowSpan > 0)
</script>

<DataTableRow>
	{#if mustSpan}
		<DataTableHeader scope="row" rowSpan={categoryNameRowSpan}>{categoryName}</DataTableHeader>
	{/if}
	<DataTableCell>{accountName}</DataTableCell>
	<DataTableCell kind="numeric">{shownAmount}</DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}
