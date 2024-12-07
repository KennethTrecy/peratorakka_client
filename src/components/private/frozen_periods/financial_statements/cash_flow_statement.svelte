<script lang="ts">
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type {
	Currency,
	CashFlowActivity,
	Account,
	FlowCalculation
} from "+/entity"

import convertAmount from "$/utility/convert_amount"
import deriveExchangeRateQuickly from "$/utility/derive_exchange_rate_quickly"
import formatAmount from "$/utility/format_amount"

import TotalAmountRow
	from "%/frozen_periods/financial_statements/cash_flow_statement/total_amount_row.svelte"
import CategorizedSection
	from "%/frozen_periods/financial_statements/cash_flow_statement/categorized_section.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

export let statement: FinancialStatementGroup
export let exchangeRates: ExchangeRateInfo[]
export let viewedCurrency: Currency
export let currencies: Currency[]
export let cashFlowActivities: CashFlowActivity[]
export let accounts: Account[]
export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

$: exchangeRate = deriveExchangeRateQuickly(
	statement.currency_id,
	viewedCurrency.id,
	currencies,
	exchangeRates
)

$: subtotals = statement.cash_flow_statement.subtotals
$: convertedAmount = convertAmount(
	statement.cash_flow_statement.liquid_amount_difference,
	exchangeRate
)
$: friendlyLiquidAmountDifference = formatAmount(viewedCurrency, convertedAmount)
</script>

<QuarternaryHeading>Cash Flow Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader scope="column">Name</DataTableHeader>
		<DataTableHeader scope="column">Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each cashFlowActivities as cashFlowActivity}
			<CategorizedSection
				cashFlowActivity={cashFlowActivity}
				cashFlowSubtotals={subtotals}
				{viewedCurrency}
				{exchangeRates}
				{currencies}
				{accounts}
				{flowCalculations}/>
		{/each}
		<TotalAmountRow
			rowName="Opened Liquid Balance"
			{exchangeRate}
			currency={viewedCurrency}
			rawAmount={statement.cash_flow_statement.opened_liquid_amount}/>
		<TotalAmountRow
			rowName="Closed Liquid Balance"
			{exchangeRate}
			currency={viewedCurrency}
			rawAmount={statement.cash_flow_statement.closed_liquid_amount}/>
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row" columnSpan={2}>Difference</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyLiquidAmountDifference}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
