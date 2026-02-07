<script lang="ts">
import AmountDisplay from "$/utility/amount_display.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"

let {
	rowName,
	shownAmount,
	exactAmount,
	hasEmptyTrailingRow = false
}: {
	rowName: string
	shownAmount: string
	exactAmount: string
	hasEmptyTrailingRow?: boolean
} = $props()

let isNegative = $derived(shownAmount.indexOf(")") > -1)
let title = $derived(`Exact value is ${exactAmount}`)
</script>

<DataTableRow>
	<DataTableHeader scope="row" columnSpan={2}>{rowName}</DataTableHeader>
	<DataTableCell kind="numeric" {title}><AmountDisplay {shownAmount}/>{#if isNegative}<span aria-hidden="true">)</span>{/if}</DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}

<style>
span {
	color: transparent;
}
</style>
