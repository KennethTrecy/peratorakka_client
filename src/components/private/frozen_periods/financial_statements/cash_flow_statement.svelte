<script lang="ts">
import type { SimplifiedFlowCalculation } from "+/component"
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type {
	PrecisionFormat,
	Currency,
	CashFlowActivity
} from "+/entity"

import makeShownAmount from "$/utility/make_shown_amount"

import TotalAmountRow
	from "%/frozen_periods/financial_statements/cash_flow_statement/total_amount_row.svelte"
import CategorizedSection
	from "%/frozen_periods/financial_statements/cash_flow_statement/categorized_section.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

let {
	statement,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	precisionFormats,
	currencies,
	emptyAmount,
	cashFlowActivities,
	data
}: {
	statement: FinancialStatementGroup
	statementExchangeRate: ExchangeRateInfo
	statementCurrency: Currency
	viewedCurrency: Currency
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	emptyAmount: string
	cashFlowActivities: CashFlowActivity[]
	data: SimplifiedFlowCalculation[]
} = $props()

let friendlyOpenedLiquidAmount = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.cash_flow_statement.opened_real_liquid_amount
))
let friendlyClosedLiquidAmount = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.cash_flow_statement.closed_real_liquid_amount
))
let friendlyLiquidAmountDifference = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.cash_flow_statement.real_liquid_amount_difference
))
let shownCashFlowSubtotals = $derived(statement.cash_flow_statement.subtotals.map(
	subtotal => ({
		...subtotal,
		"net_income": makeShownAmount(
			precisionFormats,
			currencies,
			statementExchangeRate,
			statementCurrency,
			viewedCurrency,
			subtotal.net_income
		),
		"subtotal": makeShownAmount(
			precisionFormats,
			currencies,
			statementExchangeRate,
			statementCurrency,
			viewedCurrency,
			subtotal.subtotal
		)
	})
))
</script>

<QuarternaryHeading>Cash Flow Statement</QuarternaryHeading>
<UnitDataTable>
	{#snippet table_headers()}
		<DataTableHeader scope="column">Name</DataTableHeader>
		<DataTableHeader scope="column">Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Amount</DataTableHeader>
	{/snippet}
	{#snippet table_rows()}
		{#each cashFlowActivities as cashFlowActivity}
			<CategorizedSection
				{emptyAmount}
				{cashFlowActivity}
				{shownCashFlowSubtotals}
				{data}/>
		{/each}
		<TotalAmountRow
			rowName="Opened Liquid Balance"
			shownAmount={friendlyOpenedLiquidAmount}/>
		<TotalAmountRow
			rowName="Closed Liquid Balance"
			shownAmount={friendlyClosedLiquidAmount}/>
	{/snippet}
	{#snippet table_footer_cells()}
		<DataTableHeader scope="row" columnSpan={2}>Difference</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyLiquidAmountDifference}</DataTableCell>
	{/snippet}
</UnitDataTable>
