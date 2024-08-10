<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type {
		Account,
		Currency,
		Modifier,
		FinancialEntry
	} from "+/entity"

	import transformModifier from "$/form/choice_info_transformer/transform_modifier"

	import BasicForm from "$/form/basic_form.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import TextField from "$/form/text_field.svelte"

	export let IDPrefix: string
	export let currencies: Currency[]
	export let accounts: Account[]
	export let modifiers: Modifier[]

	export let modifierID: string
	export let transactedAt: string
	export let debitAmount: string
	export let creditAmount: string
	export let remarks: string
	export let forceDisabledFields: (keyof FinancialEntry)[] = []

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id: string|null = null

	$: availableModifiers = modifiers.filter(modifier => modifier.deleted_at === null)
	$: chosenModifier = modifiers.find(
		modifier => `${modifier.id}` === modifierID
	)
	$: debitAccount = chosenModifier && accounts.find(
		account => account.id === chosenModifier?.debit_account_id
	)
	$: creditAccount = chosenModifier && accounts.find(
		account => account.id === chosenModifier?.credit_account_id
	)
	$: debitCurrency = debitAccount && currencies.find(
		currency => currency.id === debitAccount?.currency_id
	)
	$: creditCurrency = creditAccount && currencies.find(
		currency => currency.id === creditAccount?.currency_id
	)
	$: hasSameCurrency = debitCurrency === creditCurrency
	$: {
		if (hasSameCurrency) creditAmount = debitAmount
	}

	$: debitLabel = `${
		hasSameCurrency
			? "Debit and Credit Amount"
			: "Debit Amount"
		} (${debitCurrency?.code ?? ""})`
	$: creditLabel = `${
		hasSameCurrency
			? "Debit and Credit Amount"
			: "Credit Amount"
		} (${debitCurrency?.code ?? ""})`
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Modifier"
			errorFieldName="modifier_id"
			disabled={isConnecting || forceDisabledFields.includes("modifier_id")}
			bind:value={modifierID}
			rawChoices={availableModifiers}
			choiceConverter={transformModifier}
			{IDPrefix}
			{errors}/>
		<TextField
			variant="date"
			fieldName="Transaction Date"
			errorFieldName="transacted_at"
			disabled={isConnecting || forceDisabledFields.includes("transacted_at")}
			bind:value={transactedAt}
			{IDPrefix}
			{errors}/>
		{#if hasSameCurrency}
			<TextField
				fieldName={debitLabel}
				errorFieldName="debit_amount"
				disabled={
					isConnecting
					|| forceDisabledFields.includes("debit_amount")
					|| forceDisabledFields.includes("credit_amount")
				}
				bind:value={debitAmount}
				{IDPrefix}
				{errors}/>
		{:else}
			<TextField
				fieldName={debitLabel}
				errorFieldName="debit_amount"
				disabled={isConnecting || forceDisabledFields.includes("debit_amount")}
				bind:value={debitAmount}
				{IDPrefix}
				{errors}/>
			<TextField
				fieldName={creditLabel}
				errorFieldName="credit_amount"
				disabled={isConnecting || forceDisabledFields.includes("credit_amount")}
				bind:value={creditAmount}
				{IDPrefix}
				{errors}/>
		{/if}
		<TextField
			fieldName="Remarks"
			errorFieldName="remarks"
			disabled={isConnecting || forceDisabledFields.includes("remarks")}
			bind:value={remarks}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
