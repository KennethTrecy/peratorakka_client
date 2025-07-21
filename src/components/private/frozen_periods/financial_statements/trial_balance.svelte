<script lang="ts">
import type { PrecisionFormat, Currency } from "+/entity"
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type { SimplifiedSummaryCalculation, TrialBalanceKind } from "+/component"

import makeShownAmount from "$/utility/make_shown_amount"

import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

let {
	kind,
	statement,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	precisionFormats,
	currencies,
	data
}: {
	kind: TrialBalanceKind
	statement: FinancialStatementGroup
	statementExchangeRate: ExchangeRateInfo
	statementCurrency: Currency
	viewedCurrency: Currency
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	data: SimplifiedSummaryCalculation[]
} = $props()

let headingAdjective = $derived(kind === "adjusted" ? "Adjusted" : "Unadjusted")
let totalDebitAmount = $derived(
	kind === "adjusted"
		? statement.adjusted_trial_balance.debit_total
		: statement.unadjusted_trial_balance.debit_total
)
let friendlyTotalDebitAmount = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	totalDebitAmount
))
let totalCreditAmount = $derived(
	kind === "adjusted"
		? statement.adjusted_trial_balance.credit_total
		: statement.unadjusted_trial_balance.credit_total
)
let friendlyTotalCreditAmount = $derived(makeShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	totalCreditAmount
))
</script>

<QuarternaryHeading>{headingAdjective} Trial Balance</QuarternaryHeading>
<UnitDataTable>
	{#snippet table_headers()}
		<DataTableHeader scope="column">Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Debit Amount</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Credit Amount</DataTableHeader>
	{/snippet}
	{#snippet table_rows()}
		{#each data as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
	{/snippet}
	{#snippet table_footer_cells()}
		<DataTableHeader scope="row">Total</DataTableHeader>
		<DataTableCell kind="numeric">{friendlyTotalDebitAmount}</DataTableCell>
		<DataTableCell kind="numeric">{friendlyTotalCreditAmount}</DataTableCell>
	{/snippet}
</UnitDataTable>
