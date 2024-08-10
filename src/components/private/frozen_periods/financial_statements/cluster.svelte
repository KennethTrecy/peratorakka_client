<script lang="ts">
	import type { FinancialStatementGroup, ExchangeRateInfo } from "+/rest"
	import type {
		Currency,
		CashFlowActivity,
		Account,
		SummaryCalculation,
		FlowCalculation
	} from "+/entity"

	import { ANY_CURRENCY } from "#/component"
	import { ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY } from "#/entity"

	import transformCurrency from "$/form/choice_info_transformer/transform_currency"
	import deriveExchangeRate from "$/utility/derive_exchange_rate"

	import BalanceSheet from "%/frozen_periods/financial_statements/balance_sheet.svelte"
	import CashFlowStatement from "%/frozen_periods/financial_statements/cash_flow_statement.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import IncomeStatement from "%/frozen_periods/financial_statements/income_statement.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import TextContainer from "$/typography/text_container.svelte"
	import TrialBalance from "%/frozen_periods/financial_statements/trial_balance.svelte"

	export let statement: FinancialStatementGroup
	export let exchangeRates: ExchangeRateInfo[]
	export let currencies: Currency[]
	export let cashFlowActivities: CashFlowActivity[]
	export let accounts: Account[]
	export let summaryCalculations: Omit<SummaryCalculation, "frozen_period_id">[]
	export let flowCalculations: Omit<FlowCalculation, "frozen_period_id">[]

	$: currency = currencies.find(
		currency => currency.id === statement.currency_id
	) ?? ANY_CURRENCY
	$: allowAnyItem = currency.id === ANY_CURRENCY.id
	$: allowedAccounts = accounts.filter(
		account => allowAnyItem || account.currency_id === statement.currency_id
	)
	$: allowedAccountIDs = allowedAccounts.map(account => account.id)
	$: allowedSummaryCalculations = summaryCalculations.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	).sort((left, right) => {
		const leftAccount = allowedAccounts.find(account => account.id === left.account_id) as Account
		const rightAccount = allowedAccounts.find(
			account => account.id === right.account_id
		) as Account

		const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[leftAccount.kind]
		const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[rightAccount.kind]
		return leftAccountKindImportance < rightAccountKindImportance
			? -1
			: leftAccountKindImportance > rightAccountKindImportance
				? 1
				: leftAccount.name.localeCompare(rightAccount.name)
	})
	$: allowedFlowCalculations = flowCalculations.filter(
		calculation => allowedAccountIDs.indexOf(calculation.account_id) > -1
	).sort((left, right) => {
		const leftAccount = allowedAccounts.find(account => account.id === left.account_id) as Account
		const rightAccount = allowedAccounts.find(
			account => account.id === right.account_id
		) as Account

		const leftAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[leftAccount.kind]
		const rightAccountKindImportance = ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY[rightAccount.kind]
		return leftAccountKindImportance < rightAccountKindImportance
			? -1
			: leftAccountKindImportance > rightAccountKindImportance
				? 1
				: leftAccount.name.localeCompare(rightAccount.name)
	})
	$: hasAcceptableCashFlowActivities = cashFlowActivities.length > 0

	let targetCurrencyID = ""
	let oldShownCurrencyID = ""
	$: {
		if (oldShownCurrencyID !== `${currency.id}`) {
			oldShownCurrencyID = `${currency.id}`

			let oldTargetCurrencyID = targetCurrencyID
			if (oldShownCurrencyID === `${ANY_CURRENCY.id}`) {
				targetCurrencyID = oldTargetCurrencyID === ""
					? `${currencies[0].id}`
					: oldTargetCurrencyID
			} else {
				targetCurrencyID = oldShownCurrencyID
			}
		}
	}

	$: viewedCurrency = currencies.find(
		currency => `${currency.id}` === targetCurrencyID
	) ?? currencies[0]
</script>

<GridCell kind="full">
	<Flex direction="column" mustPad={false}>
		<TextContainer>
			<ShortParagraph>
				Amounts are viewed in
				<ChoiceListField
					fieldName="Target Currency"
					errorFieldName="currency_id"
					disabled={false}
					mustExpand={true}
					bind:value={targetCurrencyID}
					rawChoices={currencies}
					choiceConverter={transformCurrency}
					errors={[]}/> currency.
			</ShortParagraph>
		</TextContainer>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<BalanceSheet
			{statement}
			{viewedCurrency}
			{exchangeRates}
			{currencies}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		<IncomeStatement
			{statement}
			{viewedCurrency}
			{exchangeRates}
			{currencies}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="triad">
	<Flex direction="column" mustPad={false}>
		{#if hasAcceptableCashFlowActivities}
			<CashFlowStatement
				{statement}
				{viewedCurrency}
				{exchangeRates}
				{currencies}
				{cashFlowActivities}
				accounts={allowedAccounts}
				flowCalculations={allowedFlowCalculations}/>
		{:else}
			<ElementalParagraph>
				Note: There are no accounts that belongs to cash flows activities. At least one account must belong to a cash flow activity.
			</ElementalParagraph>
		{/if}
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="unadjusted"
			{statement}
			{viewedCurrency}
			{exchangeRates}
			{currencies}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
<GridCell kind="pair">
	<Flex direction="column" mustPad={false}>
		<TrialBalance
			kind="adjusted"
			{statement}
			{viewedCurrency}
			{exchangeRates}
			{currencies}
			accounts={allowedAccounts}
			data={allowedSummaryCalculations}/>
	</Flex>
</GridCell>
