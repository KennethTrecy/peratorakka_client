<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		SummaryCalculation,
		FlowCalculation
	} from "+/entity"

	import BalanceSheet from "%/frozen_periods/financial_statements/balance_sheet.svelte"
	import CashFlowStatement from "%/frozen_periods/financial_statements/cash_flow_statement.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IncomeStatement from "%/frozen_periods/financial_statements/income_statement.svelte"
	import TrialBalance from "%/frozen_periods/financial_statements/trial_balance.svelte"

	export let statement: FinancialStatementGroup
	export let currencies: Currency[]
	export let cashFlowActivities: CashFlowActivity[]
	export let accounts: Account[]
	export let summaryCalculations: Omit<SummaryCalculation, "frozen_period_id">[]
	export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

	$: currency = currencies.find(currency => currency.id === statement.currency_id)
	$: allowedAccounts = accounts.filter(account => account.currency_id === statement.currency_id)
	$: allowedAccountIDs = allowedAccounts.map(account => account.id)
	$: allowedSummaryCalculations = summaryCalculations.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: allowedFlowCalculations = flowCalculations.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: hasAcceptableCashFlowActivities = cashFlowActivities.length > 1
</script>

<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<BalanceSheet
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<IncomeStatement
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		{#if hasAcceptableCashFlowActivities}
			<CashFlowStatement
				{statement}
				{currency}
				{cashFlowActivities}
				accounts={allowedAccounts}
				flowCalculations={allowedFlowCalculations}/>
		{:else}
			<ElementalParagraph>
				Note: There are no or few accounts that belongs to cash flows activities. At least one account must belong to a cash flow activity.
			</ElementalParagraph>
		{/if}
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="unadjusted"
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="adjusted"
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
