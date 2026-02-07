<script lang="ts">
import type { SimplifiedFlowCalculation } from "+/component"
import type { CashFlowActivitySubtotal, ApproximateAndExactFormats } from "+/rest"
import type { CashFlowActivity } from "+/entity"

import { temporaryAccountKinds } from "#/entity"

import AmountRow
	from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"

let {
	emptyAmount,
	cashFlowActivity,
	shownCashFlowSubtotals,
	data
}: {
	emptyAmount: string
	cashFlowActivity: CashFlowActivity
	shownCashFlowSubtotals: CashFlowActivitySubtotal<ApproximateAndExactFormats>[]
	data: SimplifiedFlowCalculation[]
} = $props()

let matchedSubtotal = $derived(shownCashFlowSubtotals.find(
	subtotal => subtotal.cash_flow_activity_id === cashFlowActivity.id
) as CashFlowActivitySubtotal<ApproximateAndExactFormats>|undefined)
let matchedFlowCalculations = $derived(data.filter(
	flowCalculation => (
		flowCalculation.cashFlowActivity.id === cashFlowActivity.id
		&& temporaryAccountKinds.indexOf(flowCalculation.account.kind) === -1
		&& flowCalculation.amount !== emptyAmount
	)
))
let hasNetIncome = $derived(matchedSubtotal?.net_income[1] !== emptyAmount)
let rowCountBeforeAccounts = $derived(hasNetIncome ? 1 : 0)
let firstRowSpan = $derived(matchedFlowCalculations.length + 1 + rowCountBeforeAccounts)
</script>

{#if typeof matchedSubtotal !== "undefined"}
	{#if hasNetIncome}
		<AmountRow
			categoryName={cashFlowActivity.name}
			categoryNameRowSpan={firstRowSpan}
			accountName="Net income"
			shownAmount={matchedSubtotal.net_income[0]}
			exactAmount={matchedSubtotal.net_income[1]}/>
	{/if}
	{#each matchedFlowCalculations as flowCalculation, i}
		<AmountRow
			categoryName={cashFlowActivity.name}
			categoryNameRowSpan={i + rowCountBeforeAccounts === 0 ? firstRowSpan : 0}
			accountName={flowCalculation.account.name}
			shownAmount={flowCalculation.amount}
			exactAmount={flowCalculation.rawAmount}/>
	{/each}
	<AmountRow
		categoryName={cashFlowActivity.name}
		categoryNameRowSpan={0}
		accountName="Balance"
		shownAmount={matchedSubtotal.subtotal[0]}
		exactAmount={matchedSubtotal.subtotal[1]}/>
{/if}
