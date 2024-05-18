<script lang="ts">
	import type { Currency, CashFlowCategory, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

	import formatAmount from "$/utility/format_amount"

	import AmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let currency: Currency|undefined
	export let cashFlowCategories: CashFlowCategory[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: friendlyClosedLiquidAmount = formatAmount(
		currency,
		statement.cash_flow_statement.closed_liquid_amount
	)
</script>

<QuarternaryHeading>Cash Flow Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader scope="column">Category</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		<AmountRow
			rowName="Total Opened Liquid Amount"
			currency={currency}
			rawAmount={statement.cash_flow_statement.opened_liquid_amount}
			hasEmptyTrailingRow={true}/>
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row">Total Closed Liquid Amount</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyClosedLiquidAmount}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
