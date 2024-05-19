<script lang="ts">
	import type { Account, CashFlowCategory, Currency, SummaryCalculation } from "+/entity"
	import type { LiquidBalance, IlliquidBalance } from "+/rest"

	import { acceptableAccountKinds, acceptableCashFlowCategoryKinds } from "#/entity"

	import calculateFlowedAmount from "$/utility/calculate_flowed_amount"
	import { isIlliquidBalance } from "+/rest"

	import AmountRow
		from "%/frozen_periods/financial_statements/cash_flow_statement/amount_row.svelte"

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
	$: matchedAccountAmounts = matchedAccounts.map(account => {
		const calculation = data.find(
			data => data.account_id === account.id
		) as SummaryCalculation
		const acceptableAccountKindIndex = ([ ...acceptableAccountKinds ] as string[])
			.indexOf(account.kind as string)
		const acceptableCashFlowCategoryKindIndex = (
			[ ...acceptableCashFlowCategoryKinds ] as string[]
		).indexOf(cashFlowCategory.kind as string)

		const rawAmount = acceptableAccountKindIndex > -1 && acceptableCashFlowCategoryKindIndex > -1
			? calculateFlowedAmount(
				acceptableCashFlowCategoryKinds[acceptableCashFlowCategoryKindIndex],
				acceptableAccountKinds[acceptableAccountKindIndex],
				calculation
			)
			: "0"

		return {
			"accountName": account.name,
			rawAmount
		}
	})
	$: changedAmountInfo = matchedAccountAmounts.filter(
		amountInfo => amountInfo.rawAmount === "0"
	)
	$: rowCountBeforeAccounts = isIlliquidBalance(matchedSubtotal) ? 1 : 0
	$: firstRowSpan = changedAmountInfo.length + 1 + rowCountBeforeAccounts
</script>

{#if isIlliquidBalance(matchedSubtotal)}
	<AmountRow
		categoryName={cashFlowCategory.name}
		categoryNameRowSpan={firstRowSpan}
		currency={currency}
		accountName="Net income"
		rawAmount={matchedSubtotal.net_income}/>
{/if}
{#each changedAmountInfo as amountInfo, i}
	<AmountRow
		categoryName={cashFlowCategory.name}
		categoryNameRowSpan={i + rowCountBeforeAccounts === 0 ? firstRowSpan : 0}
		currency={currency}
		accountName={amountInfo.accountName}
		rawAmount={amountInfo.rawAmount}/>
{/each}
<AmountRow
	categoryName={cashFlowCategory.name}
	categoryNameRowSpan={0}
	currency={currency}
	accountName="Balance"
	rawAmount={matchedSubtotal.subtotal}/>
