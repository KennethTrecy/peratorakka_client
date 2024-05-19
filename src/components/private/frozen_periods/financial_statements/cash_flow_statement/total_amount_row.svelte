<script lang="ts">
	import type { Currency } from "+/entity"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	export let rowName: string
	export let currency: Currency|undefined
	export let rawAmount: string
	export let hasEmptyTrailingRow: boolean = false

	$: friendlyAmount = formatAmount(
		currency,
		rawAmount
	)
</script>

<DataTableRow>
	<DataTableHeader scope="row" columnSpan={2}>{rowName}</DataTableHeader>
	<DataTableCell kind="numeric">{friendlyAmount}</DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}
