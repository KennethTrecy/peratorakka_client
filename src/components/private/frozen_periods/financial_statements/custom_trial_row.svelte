<script lang="ts">
import AmountDisplay from "$/utility/amount_display.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"

let {
	rowName,
	shownDebitAmount,
	shownCreditAmount,
	exactDebitAmount,
	exactCreditAmount,
	hasEmptyTrailingRow = false
}: {
	rowName: string
	shownDebitAmount: string
	shownCreditAmount: string
	exactDebitAmount: string
	exactCreditAmount: string
	hasEmptyTrailingRow?: boolean
} = $props()

let isPossiblyDebitAccount = $derived(shownDebitAmount !== "")
let isPossiblyCreditAccount = $derived(shownCreditAmount !== "")
let hasFilled = $derived(isPossiblyDebitAccount || isPossiblyCreditAccount)

let debitTitle = $derived(
	exactDebitAmount !== ""
		? `Exact value is ${exactDebitAmount}`
		: undefined
)
let creditTitle = $derived(
	exactCreditAmount !== ""
		? `Exact value is ${exactCreditAmount}`
		: undefined
)
</script>

{#if hasFilled}
	<DataTableRow>
		<DataTableHeader scope="row">{rowName}</DataTableHeader>
		<DataTableCell kind="numeric" title={debitTitle}><AmountDisplay shownAmount={shownDebitAmount}/></DataTableCell>
		<DataTableCell kind="numeric" title={creditTitle}><AmountDisplay shownAmount={shownCreditAmount}/></DataTableCell>
	</DataTableRow>
	{#if hasEmptyTrailingRow}
		<DataTableRow>
			<DataTableCell></DataTableCell>
		</DataTableRow>
	{/if}
{/if}
