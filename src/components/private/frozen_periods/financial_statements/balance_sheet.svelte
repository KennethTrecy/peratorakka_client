<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"

	import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
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
		<CustomTrialRow
			rowName="Total Assets"
			{currency}
			rawDebitAmount={statement.balance_sheet.total_assets}
			rawCreditAmount="0.00"
			hasEmptyTrailingRow={true}/>

		{#each liabilityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<CustomTrialRow
			rowName="Total Liabilities"
			{currency}
			rawDebitAmount="0.00"
			rawCreditAmount={statement.balance_sheet.total_liabilities}
			hasEmptyTrailingRow={true}/>

		{#each equityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<CustomTrialRow
			rowName="Net Income"
			{currency}
			rawDebitAmount="0.00"
			rawCreditAmount={statement.income_statement.net_total}/>
		<CustomTrialRow
			rowName="Total Equities"
			{currency}
			rawDebitAmount="0.00"
			rawCreditAmount={statement.balance_sheet.total_equities}/>
	</svelte:fragment>
</UnitDataTable>
