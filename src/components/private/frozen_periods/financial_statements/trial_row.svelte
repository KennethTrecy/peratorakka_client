<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"

	import { UNKNOWN_ACCOUNT } from "#/component"

	import { formatAmount } from "!/index"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	const minimumFractionDigits = 2
	const maximumFractionDigits = 8

	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">
	export let kind: "unadjusted"|"adjusted"

	$: account = accounts.find(
		account => account.id === data.account_id
	) ?? UNKNOWN_ACCOUNT
	$: emptyAmount = formatAmount(
		currency,
		"0",
		minimumFractionDigits,
		maximumFractionDigits
	)
	$: friendlyDebitAmount = formatAmount(
		currency,
		kind === "unadjusted" ? data.unadjusted_debit_amount : data.adjusted_debit_amount,
		minimumFractionDigits,
		maximumFractionDigits
	)
	$: friendlyCreditAmount = formatAmount(
		currency,
		kind === "unadjusted" ? data.unadjusted_credit_amount : data.adjusted_credit_amount,
		minimumFractionDigits,
		maximumFractionDigits
	)
	$: isPossiblyDebitAccount = friendlyDebitAmount !== emptyAmount
	$: isPossiblyCreditAccount = friendlyCreditAmount !== emptyAmount
	$: hasFilled = isPossiblyDebitAccount || isPossiblyCreditAccount

	$: shownDebitAmount = isPossiblyDebitAccount ? friendlyDebitAmount : ""
	$: shownCreditAmount = isPossiblyCreditAccount ? friendlyCreditAmount : ""
</script>

{#if hasFilled}
	<DataTableRow>
		<DataTableHeader scope="row">{account.name}</DataTableHeader>
		<DataTableCell kind="numeric">{shownDebitAmount}</DataTableCell>
		<DataTableCell kind="numeric">{shownCreditAmount}</DataTableCell>
	</DataTableRow>
{/if}
