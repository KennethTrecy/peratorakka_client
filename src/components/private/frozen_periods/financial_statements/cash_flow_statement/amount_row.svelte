<script lang="ts">
	import type { Currency } from "+/entity"
	import type { ExchangeRateInfo } from "+/rest"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	export let categoryName: string
	export let categoryNameRowSpan: number
	export let exchangeRate: ExchangeRateInfo
	export let currency: Currency|undefined
	export let accountName: string
	export let rawAmount: string
	export let hasEmptyTrailingRow: boolean = false

	$: friendlyAmount = formatAmount(
		currency,
		rawAmount
	)
	$: mustSpan = categoryNameRowSpan > 0
</script>

<DataTableRow>
	{#if mustSpan}
		<DataTableHeader scope="row" rowSpan={categoryNameRowSpan}>{categoryName}</DataTableHeader>
	{/if}
	<DataTableCell>{accountName}</DataTableCell>
	<DataTableCell kind="numeric">{friendlyAmount}</DataTableCell>
</DataTableRow>
{#if hasEmptyTrailingRow}
	<DataTableRow/>
{/if}
