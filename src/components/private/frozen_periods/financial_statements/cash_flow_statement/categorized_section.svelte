<script lang="ts">
	import type { Account, CashFlowCategory, Currency, SummaryCalculation } from "+/entity"

	import CategorizedAmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/categorized_amount_row.svelte"

	export let currency: Currency|undefined
	export let cashFlowCategory: CashFlowCategory
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: matchedAccounts = accounts.filter(
		account => account.cash_flow_category_id === cashFlowCategory.id
	)
</script>

{#each matchedAccounts as account}
	<CategorizedAmountRow
		{currency}
		{cashFlowCategory}
		{account}
		{data}/>
{/each}
