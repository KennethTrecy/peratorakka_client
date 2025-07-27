<script lang="ts">
import AmountDisplay from "$/utility/amount_display.svelte"
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
	<DataTableCell kind="numeric"><AmountDisplay {shownAmount}/></DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}
