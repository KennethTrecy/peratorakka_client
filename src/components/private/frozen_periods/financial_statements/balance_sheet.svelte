<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"

	import { EMPTY_AMOUNT } from "#/component"
	import {
		DEPRECIATIVE_ASSET_ACCOUNT_KIND,
		EQUITY_ACCOUNT_KIND,
		GENERAL_ASSET_ACCOUNT_KIND,
		LIABILITY_ACCOUNT_KIND,

		LIQUID_ASSET_ACCOUNT_KIND

	} from "#/entity"

	import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let exchangeRate: ExchangeRateInfo
	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: assetAccounts = accounts.filter(account => [
		GENERAL_ASSET_ACCOUNT_KIND,
		LIQUID_ASSET_ACCOUNT_KIND,
		DEPRECIATIVE_ASSET_ACCOUNT_KIND
	].indexOf(account.kind) > -1)
	$: assetAccountIDs = assetAccounts.map(account => account.id)
	$: liabilityAccounts = accounts.filter(account => account.kind === LIABILITY_ACCOUNT_KIND)
	$: liabilityAccountIDs = liabilityAccounts.map(account => account.id)
	$: equityAccounts = accounts.filter(account => account.kind === EQUITY_ACCOUNT_KIND)
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
		<DataTableHeader scope="column">Permanent Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Debit Amount</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Credit Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each assetCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{exchangeRate}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<CustomTrialRow
			rowName="Total Assets"
			{currency}
			{exchangeRate}
			rawDebitAmount={statement.balance_sheet.total_assets}
			rawCreditAmount={EMPTY_AMOUNT}
			hasEmptyTrailingRow={true}/>

		{#each liabilityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{exchangeRate}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<CustomTrialRow
			rowName="Total Liabilities"
			{currency}
			{exchangeRate}
			rawDebitAmount={EMPTY_AMOUNT}
			rawCreditAmount={statement.balance_sheet.total_liabilities}
			hasEmptyTrailingRow={true}/>

		{#each equityCalculations as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{exchangeRate}
				{accounts}
				data={calculation}
				kind="unadjusted"/>
		{/each}
		<CustomTrialRow
			rowName="Net Income"
			{currency}
			{exchangeRate}
			rawDebitAmount={EMPTY_AMOUNT}
			rawCreditAmount={statement.income_statement.net_total}/>
		<CustomTrialRow
			rowName="Total Equities"
			{currency}
			{exchangeRate}
			rawDebitAmount={EMPTY_AMOUNT}
			rawCreditAmount={statement.balance_sheet.total_equities}/>
	</svelte:fragment>
</UnitDataTable>
