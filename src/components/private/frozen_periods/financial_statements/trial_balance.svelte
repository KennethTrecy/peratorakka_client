<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { FinancialStatementGroup } from "+/rest"
	import type { TrialBalanceKind } from "+/component"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
	import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
	import UnitDataTable from "$/catalog/unit_data_table.svelte"

	export let kind: TrialBalanceKind
	export let statement: FinancialStatementGroup
	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: headingAdjective = kind === "adjusted" ? "Adjusted" : "Unadjusted"
	$: friendlyTotalDebitAmount = formatAmount(
		currency,
		kind === "adjusted"
			? statement.adjusted_trial_balance.debit_total
			: statement.unadjusted_trial_balance.debit_total
	)
	$: friendlyTotalCreditAmount = formatAmount(
		currency,
		kind === "adjusted"
			? statement.adjusted_trial_balance.credit_total
			: statement.unadjusted_trial_balance.credit_total
	)
</script>

<QuarternaryHeading>{headingAdjective} Trial Balance</QuarternaryHeading>
<UnitDataTable>
	<svelte:fragment slot="table_headers">
		<DataTableHeader>Account</DataTableHeader>
		<DataTableHeader>Debit Amount</DataTableHeader>
		<DataTableHeader>Credit Amount</DataTableHeader>
	</svelte:fragment>
	<svelte:fragment slot="table_rows">
		{#each data as calculation(calculation.account_id)}
			<TrialRow
				{currency}
				{accounts}
				data={calculation}
				{kind}/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="table_footer_cells">
		<DataTableHeader scope="row">Total</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyTotalDebitAmount}</DataTableCell>
		<DataTableCell kind="numeric">{friendlyTotalCreditAmount}</DataTableCell>
	</svelte:fragment>
</UnitDataTable>
