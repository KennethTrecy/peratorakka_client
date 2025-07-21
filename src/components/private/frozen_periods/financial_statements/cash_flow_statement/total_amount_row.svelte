<script lang="ts">
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"

let {
	rowName,
	shownAmount,
	hasEmptyTrailingRow = false
}: {
	rowName: string
	shownAmount: string
	hasEmptyTrailingRow?: boolean
} = $props()
</script>

<DataTableRow>
	<DataTableHeader scope="row" columnSpan={2}>{rowName}</DataTableHeader>
	<DataTableCell kind="numeric">{shownAmount}</DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}
