<script lang="ts">
	import type {
		Currency,
		CashFlowActivity,
		Account,
		FlowCalculation
	} from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

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
	export let currency: Currency|undefined
	export let cashFlowActivities: CashFlowActivity[]
	export let accounts: Account[]
	export let flowCalculations: FlowCalculation[]

	$: subtotals = statement.cash_flow_statement.subtotals
	$: friendlyClosedLiquidAmount = formatAmount(
		currency,
		statement.cash_flow_statement.closed_liquid_amount
	)
</script>

<QuarternaryHeading>Cash Flow Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader scope="column">Category</DataTableHeader>
		<DataTableHeader scope="column">Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		<TotalAmountRow
			rowName="Opened Liquid Balance"
			currency={currency}
			rawAmount={statement.cash_flow_statement.opened_liquid_amount}/>
		{#each cashFlowActivities as cashFlowActivity}
			<CategorizedSection
				cashFlowActivity={cashFlowActivity}
				cashFlowSubtotals={subtotals}
				{currency}
				{accounts}
				{flowCalculations}/>
			{/each}
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row" columnSpan={2}>Closed Liquid Amount</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyClosedLiquidAmount}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
