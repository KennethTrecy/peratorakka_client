<script lang="ts">
	import type { Currency, Account, SummaryCalculation } from "+/entity"
	import type { TrialBalanceKind } from "+/component"

	import { UNKNOWN_ACCOUNT } from "#/component"

	import formatAmount from "$/utility/format_amount"

	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"

	export let currency: Currency|undefined
	export let accounts: Account[]
	export let data: Omit<SummaryCalculation, "frozen_period_id">
	export let kind: TrialBalanceKind

	$: account = accounts.find(
		account => account.id === data.account_id
	) ?? UNKNOWN_ACCOUNT
	$: emptyAmount = formatAmount(
		currency,
		"0"
	)
	$: friendlyDebitAmount = formatAmount(
		currency,
		kind === "unadjusted" ? data.unadjusted_debit_amount : data.adjusted_debit_amount
	)
	$: friendlyCreditAmount = formatAmount(
		currency,
		kind === "unadjusted" ? data.unadjusted_credit_amount : data.adjusted_credit_amount
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
