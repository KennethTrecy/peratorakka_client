<script lang="ts">
	import type { CashFlowActivitySubtotal, ExchangeRateInfo } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		FlowCalculation
	} from "+/entity"

	import { UNKNOWN_ACCOUNT } from "#/component"
	import { acceptableAccountKinds } from "#/entity"

	import AmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"

	export let exchangeRate: ExchangeRateInfo
	export let currency: Currency
	export let cashFlowActivity: CashFlowActivity
	export let cashFlowSubtotals: CashFlowActivitySubtotal[]
	export let accounts: Account[]
	export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

	$: matchedSubtotal = cashFlowSubtotals.find(
		subtotal => subtotal.cash_flow_activity_id === cashFlowActivity.id
	) as CashFlowActivitySubtotal|undefined
	$: matchedFlowCalculations = flowCalculations.filter(
		flowCalculation => flowCalculation.cash_flow_activity_id === cashFlowActivity.id
	)
	$: accountedFlowCalculations = matchedFlowCalculations.map(flowCalculation => {
		const account = accounts.find(
			account => account.id === flowCalculation.account_id
		) ?? UNKNOWN_ACCOUNT

		return {
			...flowCalculation,
			"@meta": {
				account
			}
		}
	}).filter(flowCalculation => {
		return flowCalculation["@meta"].account.kind !== acceptableAccountKinds[3]
			&& flowCalculation["@meta"].account.kind !== acceptableAccountKinds[4]
			&& flowCalculation.net_amount !== "0"
	})
	$: hasNetIncome = matchedSubtotal?.net_income !== "0"
	$: rowCountBeforeAccounts = hasNetIncome ? 1 : 0
	$: firstRowSpan = accountedFlowCalculations.length + 1 + rowCountBeforeAccounts
</script>

{#if typeof matchedSubtotal !== "undefined"}
	{#if hasNetIncome}
		<AmountRow
			categoryName={cashFlowActivity.name}
			categoryNameRowSpan={firstRowSpan}
			currency={currency}
			{exchangeRate}
			accountName="Net income"
			rawAmount={matchedSubtotal.net_income}/>
	{/if}
	{#each accountedFlowCalculations as flowCalculation, i}
		<AmountRow
			categoryName={cashFlowActivity.name}
			categoryNameRowSpan={i + rowCountBeforeAccounts === 0 ? firstRowSpan : 0}
			currency={currency}
			{exchangeRate}
			accountName={flowCalculation["@meta"].account.name}
			rawAmount={flowCalculation.net_amount}/>
	{/each}
	<AmountRow
		categoryName={cashFlowActivity.name}
		categoryNameRowSpan={0}
		currency={currency}
		{exchangeRate}
		accountName="Balance"
		rawAmount={matchedSubtotal.subtotal}/>
{/if}
