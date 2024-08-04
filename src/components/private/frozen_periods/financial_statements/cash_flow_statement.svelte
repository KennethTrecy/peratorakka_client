<script lang="ts">
	import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		FlowCalculation
	} from "+/entity"

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
	export let exchangeRate: ExchangeRateInfo
	export let currency: Currency|undefined
	export let cashFlowActivities: CashFlowActivity[]
	export let accounts: Account[]
	export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

	$: subtotals = statement.cash_flow_statement.subtotals
	$: friendlyLiquidAmountDifference = formatAmount(
		currency,
		statement.cash_flow_statement.liquid_amount_difference
	)
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
				{currency}
				{exchangeRate}
				{accounts}
				{flowCalculations}/>
		{/each}
		<TotalAmountRow
			rowName="Opened Liquid Balance"
			currency={currency}
			rawAmount={statement.cash_flow_statement.opened_liquid_amount}/>
		<TotalAmountRow
			rowName="Closed Liquid Balance"
			currency={currency}
			rawAmount={statement.cash_flow_statement.closed_liquid_amount}/>
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row" columnSpan={2}>Difference</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyLiquidAmountDifference}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
