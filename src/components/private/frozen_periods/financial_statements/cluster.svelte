<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type { Currency, Account, SummaryCalculation } from "+/entity"

	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let statement: FinancialStatementGroup
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: currency = currencies.find(currency => currency.id === statement.currency_id)
	$: allowedAccounts = accounts.filter(account => account.currency_id === statement.currency_id)
	$: allowedAccountIDs = allowedAccounts.map(account => account.id)
	$: allowedCalculations = data.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	)
</script>

<GridCell kind="normal">
	<QuarternaryHeading>Unadjusted Trial Balance</QuarternaryHeading>
	<UnitDataTable>
		<svelte:fragment slot="table_headers">
			<DataTableHeader>Account</DataTableHeader>
			<DataTableHeader>Debit Amount</DataTableHeader>
			<DataTableHeader>Credit Amount</DataTableHeader>
		</svelte:fragment>
		<svelte:fragment slot="table_rows">
			{#each allowedCalculations as calculation(calculation.account_id)}
				<TrialRow
					{currency}
					accounts={allowedAccounts}
					data={calculation}
					kind="unadjusted"/>
			{/each}
		</svelte:fragment>
	</UnitDataTable>
</GridCell>
