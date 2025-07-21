<script lang="ts">
import type { PrecisionFormat, Currency } from "+/entity"
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type { SimplifiedSummaryCalculation } from "+/component"

import { temporaryAccountKinds } from "#/entity"

import makeCleanShownAmount from "$/utility/make_clean_shown_amount"

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
	statement: FinancialStatementGroup
	statementExchangeRate: ExchangeRateInfo
	statementCurrency: Currency
	viewedCurrency: Currency
	precisionFormats: PrecisionFormat[]
	currencies: Currency[]
	data: SimplifiedSummaryCalculation[]
} = $props()

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
let friendlyDebitedNetAmount = $derived(friendlyNetAmountInfo[0] ? friendlyNetAmountInfo[1] : "")
let friendlyCreditedNetAmount = $derived(friendlyNetAmountInfo[0] ? "" : friendlyNetAmountInfo[1])
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
		<DataTableCell kind="numeric">{friendlyDebitedNetAmount}</DataTableCell>
		<DataTableCell kind="numeric">{friendlyCreditedNetAmount}</DataTableCell>
	{/snippet}
</UnitDataTable>
