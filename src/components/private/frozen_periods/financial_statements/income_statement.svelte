<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"

	import { INCOME_ACCOUNT_KIND, EXPENSE_ACCOUNT_KIND } from "#/entity"

	import formatAmount from "$/utility/format_amount"
	import convertAmount from "$/utility/convert_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let exchangeRate: ExchangeRateInfo
	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: incomeAccounts = accounts.filter(account => account.kind === INCOME_ACCOUNT_KIND)
	$: incomeAccountIDs = incomeAccounts.map(account => account.id)
	$: expenseAccounts = accounts.filter(account => account.kind === EXPENSE_ACCOUNT_KIND)
	$: expenseAccountIDs = expenseAccounts.map(account => account.id)

	$: incomeCalculations = data.filter(
		calculation => incomeAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: expenseCalculations = data.filter(
		calculation => expenseAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: convertedNetAmount = convertAmount(
		statement.income_statement.net_total,
		exchangeRate
	)
	$: friendlyNetAmount = formatAmount(currency, convertedNetAmount)
</script>

<QuarternaryHeading>Income Statement</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader scope="column">Temporary Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Debit Amount</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Credit Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each incomeCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{exchangeRate}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		{#each expenseCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{exchangeRate}
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
