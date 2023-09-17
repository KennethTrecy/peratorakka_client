<script lang="ts">
	import type {
		Currency,
		Account,
		Modifier,
		FinancialEntry
	} from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { UNKNOWN_OPTION } from "#/component"

	import makeJSONRequester from "$/rest/make_json_requester"
	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

	import BasicForm from "%/financial_entries/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": FinancialEntry
	}>()
	const IDPrefix = "new_"
	const currentDate =  new Date()
	const currentYear =  currentDate.getFullYear()
	const currentMonth =  makeTwoDigits(currentDate.getMonth() + 1)
	const currentDay =  makeTwoDigits(currentDate.getDate())
	const defaultTransactedDate = `${currentYear}-${currentMonth}-${currentDay}`

	export let isLoadingInitialData: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let modifiers: Modifier[]

	export let modifierID: string = UNKNOWN_OPTION
	export let transactedAt: string = defaultTransactedDate
	export let debitAmount: string = "0.00"
	export let creditAmount: string = "0.00"
	export let remarks: string = ""

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/financial_entries",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { financial_entry } = document

					debitAmount = "0"
					creditAmount = "0"
					remarks = ""
					errors.set([])
					dispatch("create", financial_entry)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createModifier() {
		await send({
			"body": JSON.stringify({
				"financial_entry": {
					"modifier_id": parseInt(modifierID),
					"transacted_at": `${transactedAt} 00:00:00`,
					"debit_amount": debitAmount,
					"credit_amount": creditAmount,
					remarks
				}
			})
		})
	}

	function makeTwoDigits(value: number): string {
		return value <= 9 ? `0${value}` : `${value}`
	}

	$: manualModifiers = modifiers.filter(modifier => modifier.kind === "manual")
	$: chosenModifier = modifiers.find(
		modifier => `${modifier.id}` === modifierID
	)
	$: friendlyAction = convertSnakeCaseToProperCase(chosenModifier?.action ?? UNKNOWN_OPTION)
	$: mayShowForm = manualModifiers.length >= 1
</script>

<DescriptiveForm individualName="Financial Entry" {mayShowForm} {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Financial entries are the main data that is being processed by the system. They always have a pair of debit amount and credit amount.
		</ElementalParagraph>
		<ElementalParagraph>
			Financial entries may be created manually. In the future, automatic creation of entries may be available in the system.
		</ElementalParagraph>
		<ElementalParagraph>
			To create the manually, choose a manual modifier that would be associated with the entry. The transaction date may be earlier than the current date to track previous entries. Submit the entry after entering the debit and credit amounts and optional remarks.
		</ElementalParagraph>
	</TextContainer>
	<TextContainer slot="requirement">
		<ElementalParagraph>
			At least one manual modifier must exist in the profile to show the form for creating
			financial entries.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		currencies={currencies}
		accounts={accounts}
		modifiers={manualModifiers}
		bind:modifierID={modifierID}
		bind:transactedAt={transactedAt}
		bind:debitAmount={debitAmount}
		bind:creditAmount={creditAmount}
		bind:remarks={remarks}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createModifier}>
		<svelte:fragment slot="button_group">
			{#if chosenModifier}
				<TextCardButton
					kind="submit"
					disabled={$isConnecting}
					label={friendlyAction}/>
			{/if}
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
