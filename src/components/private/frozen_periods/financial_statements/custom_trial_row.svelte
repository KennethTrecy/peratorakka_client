<script lang="ts">
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"

let {
	rowName,
	shownDebitAmount,
	shownCreditAmount,
	hasEmptyTrailingRow = false
}: {
	rowName: string
	shownDebitAmount: string
	shownCreditAmount: string
	hasEmptyTrailingRow?: boolean
} = $props()

let isPossiblyDebitAccount = $derived(shownDebitAmount !== "")
let isPossiblyCreditAccount = $derived(shownCreditAmount !== "")
let hasFilled = $derived(isPossiblyDebitAccount || isPossiblyCreditAccount)
</script>

{#if hasFilled}
	<DataTableRow>
		<DataTableHeader scope="row">{rowName}</DataTableHeader>
		<DataTableCell kind="numeric">{shownDebitAmount}</DataTableCell>
		<DataTableCell kind="numeric">{shownCreditAmount}</DataTableCell>
	</DataTableRow>
	{#if hasEmptyTrailingRow}
		<DataTableRow>
			<DataTableCell></DataTableCell>
		</DataTableRow>
	{/if}
{/if}
