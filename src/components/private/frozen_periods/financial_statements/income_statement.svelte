<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: incomeAccounts = accounts.filter(account => account.kind === "income")
	$: incomeAccountIDs = incomeAccounts.map(account => account.id)
	$: expenseAccounts = accounts.filter(account => account.kind === "expense")
	$: expenseAccountIDs = expenseAccounts.map(account => account.id)

	$: incomeCalculations = data.filter(
		calculation => incomeAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: expenseCalculations = data.filter(
		calculation => expenseAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: friendlyNetAmount = formatAmount(
		currency,
		statement.income_statement.net_total
	)
</script>

<QuarternaryHeading>Income Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader>Temporary Account</DataTableHeader>
		<DataTableHeader>Debit</DataTableHeader>
		<DataTableHeader>Credit</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each incomeCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		{#each expenseCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row">Net Total</DataTableHeader>
		<DataTableCell></DataTableCell>
		<DataTableCell kind="numeric">{friendlyNetAmount}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
