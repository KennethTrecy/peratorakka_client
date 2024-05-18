<script lang="ts">
	import type { FinancialStatementGroup } from "+/rest"
	import type { Currency, CashFlowCategory, Account, SummaryCalculation } from "+/entity"

	import { acceptableCashFlowCategoryKinds } from "#/entity"

	import BalanceSheet from "%/frozen_periods/financial_statements/balance_sheet.svelte"
	import CashFlowStatement from "%/frozen_periods/financial_statements/cash_flow_statement.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IncomeStatement from "%/frozen_periods/financial_statements/income_statement.svelte"
	import TrialBalance from "%/frozen_periods/financial_statements/trial_balance.svelte"

	export let statement: FinancialStatementGroup
	export let currencies: Currency[]
	export let cashFlowCategories: CashFlowCategory[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: currency = currencies.find(currency => currency.id === statement.currency_id)
	$: allowedAccounts = accounts.filter(account => account.currency_id === statement.currency_id)
	$: allowedAccountIDs = allowedAccounts.map(account => account.id)
	$: allowedCalculations = data.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	)
	$: hasAcceptableCashFlowCategories = cashFlowCategories.length > 1
		&& cashFlowCategories.some(category => category.kind === acceptableCashFlowCategoryKinds[0])
		&& cashFlowCategories.some(category => category.kind === acceptableCashFlowCategoryKinds[1])
</script>

<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="unadjusted"
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<BalanceSheet
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedCalculations}/>
		<IncomeStatement
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedCalculations}/>
		{#if hasAcceptableCashFlowCategories}
			<CashFlowStatement
				{statement}
				{currency}
				{cashFlowCategories}
				accounts={allowedAccounts}
				data={allowedCalculations}/>
		{:else}
			<ElementalParagraph>
				Note: There are no or few accounts that belongs to cash flows categories. At least one account must belong to liquid cash flow category and at least one account must belong to illiquid cash flow category.
			</ElementalParagraph>
		{/if}
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="adjusted"
			{statement}
			{currency}
			accounts={allowedAccounts}
			data={allowedCalculations}/>
	</Flex>
</GridCell>
