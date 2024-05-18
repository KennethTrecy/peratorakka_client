<script lang="ts">
	import type { Account, CashFlowCategory, Currency, SummaryCalculation } from "+/entity"

	import calculateFlowedAmount from "$/utility/calculate_flowed_amount"
	import { acceptableAccountKinds, acceptableCashFlowCategoryKinds } from "#/entity"

	import AmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"

	export let currency: Currency|undefined
	export let cashFlowCategory: CashFlowCategory
	export let account: Account
	export let data: Omit<SummaryCalculation, "frozen_period_id">[]

	$: calculation = data.find(
		data => `${data.account_id}` === `${account.id}`
	) as SummaryCalculation
	$: acceptableAccountKindIndex = ([ ...acceptableAccountKinds ] as string[])
		.indexOf(account.kind as string)
	$: acceptableCashFlowCategoryKindIndex = ([ ...acceptableCashFlowCategoryKinds ] as string[])
		.indexOf(cashFlowCategory.kind as string)
	$: rawAmount = acceptableAccountKindIndex > -1 && acceptableCashFlowCategoryKindIndex > -1
		? calculateFlowedAmount(
			acceptableCashFlowCategoryKinds[acceptableCashFlowCategoryKindIndex],
			acceptableAccountKinds[acceptableAccountKindIndex],
			calculation
		)
		: "0"
	$: hasChange = rawAmount !== "0"
</script>

{#if hasChange}
	<AmountRow
		rowName={account.name}
		{currency}
		{rawAmount}/>
{/if}
