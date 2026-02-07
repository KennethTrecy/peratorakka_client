<script lang="ts">
import type { PrecisionFormat, Currency } from "+/entity"
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type { SimplifiedSummaryCalculation } from "+/component"

import { temporaryAccountKinds } from "#/entity"

import makeCleanShownAmount from "$/utility/make_clean_shown_amount"

import AmountDisplay from "$/utility/amount_display.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"
import TrialRow from "%/frozen_periods/financial_statements/trial_row.svelte"
import UnitDataTable from "$/catalog/unit_data_table.svelte"

let {
	statement,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	precisionFormats,
	currencies,
	data
}: {
	statement: FinancialStatementGroup<string>
	statementExchangeRate: ExchangeRateInfo
	statementCurrency: Currency
	viewedCurrency: Currency
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	data: SimplifiedSummaryCalculation[]
} = $props()

const emptyShownAmount = [ "", "" ]
let allowedCalculations = $derived(data.filter(calculation => (
	temporaryAccountKinds.indexOf(calculation.account.kind) > -1
)))
let positiveAccounts = $derived(allowedCalculations.filter(calculation => (
	calculation.creditAmount !== ""
)))
let negativeAccounts = $derived(allowedCalculations.filter(calculation => (
	calculation.debitAmount !== ""
)))
let friendlyNetAmountInfo = $derived(makeCleanShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.income_statement.net_total
))
let friendlyDebitedNetAmount = $derived(
	friendlyNetAmountInfo[0]
		? friendlyNetAmountInfo[1]
		: emptyShownAmount
)
let friendlyCreditedNetAmount = $derived(
	friendlyNetAmountInfo[0]
		? emptyShownAmount
		: friendlyNetAmountInfo[1]
)

let debitTitle = $derived(
	friendlyDebitedNetAmount[1] !== "0"
		? `Exact value is ${friendlyDebitedNetAmount[1]}`
		: undefined
)
let creditTitle = $derived(
	friendlyCreditedNetAmount[1] !== ""
		? `Exact value is ${friendlyCreditedNetAmount[1]}`
		: undefined
)
</script>

<QuarternaryHeading>Income Statement</QuarternaryHeading>
<UnitDataTable>
	{#snippet table_headers()}
		<DataTableHeader scope="column">Temporary Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Debit Amount</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Credit Amount</DataTableHeader>
	{/snippet}
	{#snippet table_rows()}
		{#each positiveAccounts as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
		{#each negativeAccounts as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
	{/snippet}
	{#snippet table_footer_cells()}
		<DataTableHeader scope="row">Net Total</DataTableHeader>
		<DataTableCell kind="numeric" title={debitTitle}>
			<AmountDisplay shownAmount={friendlyDebitedNetAmount[0]}/>
		</DataTableCell>
		<DataTableCell kind="numeric" title={creditTitle}>
			<AmountDisplay shownAmount={friendlyCreditedNetAmount[0]}/>
		</DataTableCell>
	{/snippet}
</UnitDataTable>
