<script lang="ts">
import type { PrecisionFormat, Currency } from "+/entity"
import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
import type { SimplifiedSummaryCalculation } from "+/component"

import { assetAccountKinds, EQUITY_ACCOUNT_KIND, LIABILITY_ACCOUNT_KIND } from "#/entity"

import makeCleanShownAmount from "$/utility/make_clean_shown_amount"

import CustomTrialRow from "%/frozen_periods/financial_statements/custom_trial_row.svelte"
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

let assetCalculations = $derived(data.filter(
	calculation => assetAccountKinds.indexOf(calculation.account.kind) > -1
))
let liabilityCalculations = $derived(data.filter(
	calculation => calculation.account.kind === LIABILITY_ACCOUNT_KIND
))
let equityCalculations = $derived(data.filter(
	calculation => calculation.account.kind === EQUITY_ACCOUNT_KIND
))
let friendlyTotalAssetInfo = $derived(makeCleanShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.balance_sheet.total_assets
))
let friendlyDebitedTotalAsset = $derived(
	friendlyTotalAssetInfo[0] ? "" : friendlyTotalAssetInfo[1]
)
let friendlyCreditedTotalAsset = $derived(
	friendlyTotalAssetInfo[0] ? friendlyTotalAssetInfo[1] : ""
)
let friendlyTotalLiabilities = $derived(makeCleanShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.balance_sheet.total_liabilities
))
let friendlyDebitedTotalLiabilities = $derived(
	friendlyTotalLiabilities[0] ? friendlyTotalLiabilities[1] : ""
)
let friendlyCreditedTotalLiabilities = $derived(
	friendlyTotalLiabilities[0] ? "" : friendlyTotalLiabilities[1]
)
let friendlyTotalEquities = $derived(makeCleanShownAmount(
	precisionFormats,
	currencies,
	statementExchangeRate,
	statementCurrency,
	viewedCurrency,
	statement.balance_sheet.total_equities
))
let friendlyDebitedTotalEquities = $derived(
	friendlyTotalEquities[0] ? friendlyTotalEquities[1] : ""
)
let friendlyCreditedTotalEquities = $derived(
	friendlyTotalEquities[0] ? "" : friendlyTotalEquities[1]
)
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

<QuarternaryHeading>Balance Sheet</QuarternaryHeading>
<UnitDataTable>
	{#snippet table_headers()}
		<DataTableHeader scope="column">Permanent Account</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Debit Amount</DataTableHeader>
		<DataTableHeader scope="column" kind="numeric">Credit Amount</DataTableHeader>
	{/snippet}
	{#snippet table_rows()}
		{#each assetCalculations as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
		<CustomTrialRow
			rowName="Total Assets"
			shownDebitAmount={friendlyDebitedTotalAsset}
			shownCreditAmount={friendlyCreditedTotalAsset}
			hasEmptyTrailingRow={true}/>
		{#each liabilityCalculations as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
		<CustomTrialRow
			rowName="Total Liabilities"
			shownDebitAmount={friendlyDebitedTotalLiabilities}
			shownCreditAmount={friendlyCreditedTotalLiabilities}
			hasEmptyTrailingRow={true}/>
		{#each equityCalculations as calculation(calculation.account.id)}
			<TrialRow data={calculation}/>
		{/each}
		<CustomTrialRow
			rowName="Net Income"
			shownDebitAmount={friendlyDebitedNetAmount}
			shownCreditAmount={friendlyCreditedNetAmount}/>
		<CustomTrialRow
			rowName="Total Equities"
			shownDebitAmount={friendlyDebitedTotalEquities}
			shownCreditAmount={friendlyCreditedTotalEquities}/>
	{/snippet}
</UnitDataTable>
