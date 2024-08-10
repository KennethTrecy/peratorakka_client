<script lang="ts">
	import type { ExchangeRateInfo } from "+/rest"
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { TrialBalanceKind } from "+/component"

	import { UNKNOWN_ACCOUNT } from "#/component"

	import resolveAmount from "$/utility/resolve_amount"
	import deriveExchangeRateQuickly from "$/utility/derive_exchange_rate_quickly"

	import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"

	export let viewedCurrency: Currency
	export let exchangeRates: ExchangeRateInfo[]
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">
	export let kind: TrialBalanceKind

	$: account = accounts.find(
		account => account.id === data.account_id
	) ?? UNKNOWN_ACCOUNT

	$: rawDebitAmount = kind === "unadjusted"
		? resolveAmount(data.unadjusted_debit_amount, data.unadjusted_credit_amount)
		: resolveAmount(data.closed_debit_amount, data.closed_credit_amount)
	$: rawCreditAmount = kind === "unadjusted"
		? resolveAmount(data.unadjusted_credit_amount, data.unadjusted_debit_amount)
		: resolveAmount(data.closed_credit_amount, data.closed_debit_amount)

	$: exchangeRate = deriveExchangeRateQuickly(
		account.currency_id,
		viewedCurrency.id,
		currencies,
		exchangeRates
	)
</script>

<CustomTrialRow
	rowName={account.name}
	currency={viewedCurrency}
	{exchangeRate}
	{rawDebitAmount}
	{rawCreditAmount}/>
