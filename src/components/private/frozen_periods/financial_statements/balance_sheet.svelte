<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: assetAccounts = accounts.filter(account => account.kind === "asset")
	$: assetAccountIDs = assetAccounts.map(account => account.id)
	$: liabilityAccounts = accounts.filter(account => account.kind === "liability")
	$: liabilityAccountIDs = liabilityAccounts.map(account => account.id)
	$: equityAccounts = accounts.filter(account => account.kind === "equity")
	$: equityAccountIDs = equityAccounts.map(account => account.id)

	$: assetCalculations = data.filter(
		calculation => assetAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: liabilityCalculations = data.filter(
		calculation => liabilityAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: equityCalculations = data.filter(
		calculation => equityAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: friendlyTotalAssets = formatAmount(
		currency,
		statement.balance_sheet.total_assets
	)
	$: friendlyTotalLiabilities = formatAmount(
		currency,
		statement.balance_sheet.total_liabilities
	)
	$: friendlyTotalEquities = formatAmount(
		currency,
		statement.balance_sheet.total_equities
	)

	$: friendlyNetAmount = formatAmount(
		currency,
		statement.income_statement.net_total
	)
</script>

<QuarternaryHeading>Balance Sheet</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader>Permanent Account</DataTableHeader>
		<DataTableHeader>Debit</DataTableHeader>
		<DataTableHeader>Credit</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each assetCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<DataTableRow>
			<DataTableHeader scope="row">Total Assets</DataTableHeader>
			<DataTableCell kind="numeric">{friendlyTotalAssets}</DataTableCell>
			<DataTableCell></DataTableCell>
		</DataTableRow>

		<DataTableRow/>

		{#each liabilityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<DataTableRow>
			<DataTableHeader scope="row">Total Liabilities</DataTableHeader>
			<DataTableCell></DataTableCell>
			<DataTableCell kind="numeric">{friendlyTotalLiabilities}</DataTableCell>
		</DataTableRow>

		<DataTableRow/>

		{#each equityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<DataTableRow>
			<DataTableHeader scope="row">Net Income</DataTableHeader>
			<DataTableCell></DataTableCell>
			<DataTableCell kind="numeric">{friendlyNetAmount}</DataTableCell>
		</DataTableRow>
		<DataTableRow>
			<DataTableHeader scope="row">Total Equities</DataTableHeader>
			<DataTableCell></DataTableCell>
			<DataTableCell kind="numeric">{friendlyTotalEquities}</DataTableCell>
		</DataTableRow>
	</svelte:fragment>
</UnitDataTable>
