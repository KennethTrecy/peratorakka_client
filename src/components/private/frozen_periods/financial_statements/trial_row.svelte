<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { TrialBalanceKind } from "+/component"

	import { UNKNOWN_ACCOUNT } from "#/component"

	import resolvedAmount from "$/utility/resolved_amount"

	import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"

	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">
	export let kind: TrialBalanceKind

	$: account = accounts.find(
		account => account.id === data.account_id
	) ?? UNKNOWN_ACCOUNT
	$: rawDebitAmount = kind === "unadjusted"
		? resolvedAmount(data.unadjusted_debit_amount, data.unadjusted_credit_amount)
		: resolvedAmount(data.closed_debit_amount, data.closed_credit_amount)
	$: rawCreditAmount = kind === "unadjusted"
		? resolvedAmount(data.unadjusted_credit_amount, data.unadjusted_debit_amount)
		: resolvedAmount(data.closed_credit_amount, data.closed_debit_amount)
</script>

<CustomTrialRow
	rowName={account.name}
	{currency}
	{rawDebitAmount}
	{rawCreditAmount}/>
