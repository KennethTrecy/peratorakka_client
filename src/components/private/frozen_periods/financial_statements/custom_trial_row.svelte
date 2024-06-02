<script lang="ts">
	import type { Currency } from "+/entity"

	import { EMPTY_AMOUNT } from "#/component"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	export let rowName: string
	export let currency: Currency|undefined
	export let rawDebitAmount: string
	export let rawCreditAmount: string
	export let hasEmptyTrailingRow: boolean = false

	$: friendlyDebitAmount = formatAmount(
		currency,
		rawDebitAmount
	)
	$: friendlyCreditAmount = formatAmount(
		currency,
		rawCreditAmount
	)
	$: isPossiblyDebitAccount = friendlyDebitAmount !== EMPTY_AMOUNT
	$: isPossiblyCreditAccount = friendlyCreditAmount !== EMPTY_AMOUNT
	$: hasFilled = isPossiblyDebitAccount || isPossiblyCreditAccount

	$: shownDebitAmount = isPossiblyDebitAccount ? friendlyDebitAmount : ""
	$: shownCreditAmount = isPossiblyCreditAccount ? friendlyCreditAmount : ""
</script>

{#if hasFilled}
	<DataTableRow>
		<DataTableHeader scope="row">{rowName}</DataTableHeader>
		<DataTableCell kind="numeric">{shownDebitAmount}</DataTableCell>
		<DataTableCell kind="numeric">{shownCreditAmount}</DataTableCell>
	</DataTableRow>
	{#if hasEmptyTrailingRow}
		<DataTableRow/>
	{/if}
{/if}
