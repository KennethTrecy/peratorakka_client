<script lang="ts">
	import type { Account, CashFlowCategory, Currency, SummaryCalculation } from "+/entity"
	import type { LiquidBalance, IlliquidBalance } from "+/rest"

	import { isIlliquidBalance } from "+/rest"

	import CategorizedAmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/categorized_amount_row.svelte"
	import TotalAmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/total_amount_row.svelte"

	export let currency: Currency|undefined
	export let cashFlowCategory: CashFlowCategory
	export let cashFlowSubtotals: (LiquidBalance|IlliquidBalance)[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: matchedAccounts = accounts.filter(
		account => account.cash_flow_category_id === cashFlowCategory.id
	)
	$: matchedSubtotal = cashFlowSubtotals.find(
		subtotal => subtotal.cash_flow_category_id === cashFlowCategory.id
	) as LiquidBalance|IlliquidBalance
</script>

{#if isIlliquidBalance(matchedSubtotal)}
	<TotalAmountRow
		rowName="Net Income"
		currency={currency}
		rawAmount={matchedSubtotal.net_income}/>
{/if}
{#each matchedAccounts as account}
	<CategorizedAmountRow
		{currency}
		{cashFlowCategory}
		{account}
		{data}/>
{/each}
<TotalAmountRow
	rowName="Opened Liquid Balance"
	currency={currency}
	rawAmount={matchedSubtotal.subtotal}/>
