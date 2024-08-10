<script lang="ts">
	import type { Currency } from "+/entity"
	import type { ExchangeRateInfo } from "+/rest"

	import convertAmount from "$/utility/convert_amount"
	import deriveExchangeRateQuickly from "$/utility/derive_exchange_rate_quickly"
	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	export let categoryName: string
	export let categoryNameRowSpan: number
	export let exchangeRates: ExchangeRateInfo[]
	export let viewedCurrency: Currency
	export let currencies: Currency[]
	export let baseCurrencyID: number
	export let accountName: string
	export let rawAmount: string
	export let hasEmptyTrailingRow: boolean = false

	$: exchangeRate = deriveExchangeRateQuickly(
		baseCurrencyID,
		viewedCurrency.id,
		currencies,
		exchangeRates
	)

	$: convertedAmount = convertAmount(
		rawAmount,
		exchangeRate
	)
	$: friendlyAmount = formatAmount(
		viewedCurrency,
		convertedAmount
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
