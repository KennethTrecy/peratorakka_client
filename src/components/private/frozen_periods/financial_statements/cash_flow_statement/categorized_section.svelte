<script lang="ts">
	import type {
		Currency,
		CashFlowActivity,
		Account,
		FlowCalculation
	} from "+/entity"
	import type { CashFlowActivitySubtotal } from "+/rest"

	import { UNKNOWN_ACCOUNT } from "#/component"

	import AmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"

	export let currency: Currency|undefined
	export let cashFlowActivity: CashFlowActivity
	export let cashFlowSubtotals: CashFlowActivitySubtotal[]
	export let accounts: Account[]
	export let flowCalculations: FlowCalculation[]

	$: matchedSubtotal = cashFlowSubtotals.find(
		subtotal => subtotal.cash_flow_activity_id === cashFlowActivity.id
	) as CashFlowActivitySubtotal
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
	})
	$: hasNetIncome = matchedSubtotal.net_income !== "0"
	$: rowCountBeforeAccounts = hasNetIncome ? 1 : 0
	$: firstRowSpan = matchedFlowCalculations.length + 1 + rowCountBeforeAccounts
</script>

{#if hasNetIncome}
	<AmountRow
		categoryName={cashFlowActivity.name}
		categoryNameRowSpan={firstRowSpan}
		currency={currency}
		accountName="Net income"
		rawAmount={matchedSubtotal.net_income}/>
{/if}
{#each accountedFlowCalculations as flowCalculation, i}
	<AmountRow
		categoryName={cashFlowActivity.name}
		categoryNameRowSpan={i + rowCountBeforeAccounts === 0 ? firstRowSpan : 0}
		currency={currency}
		accountName={flowCalculation["@meta"].account.name}
		rawAmount={flowCalculation.net_amount}/>
{/each}
<AmountRow
	categoryName={cashFlowActivity.name}
	categoryNameRowSpan={0}
	currency={currency}
	accountName="Balance"
	rawAmount={matchedSubtotal.subtotal}/>
