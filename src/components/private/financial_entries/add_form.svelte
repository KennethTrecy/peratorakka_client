<script lang="ts">
	import type {
		Currency,
		Account,
		AcceptableModifierKind,
		AcceptableModifierAction,
		Modifier
	} from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { UNKNOWN_OPTION } from "#/component"
	import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/modifiers/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": Modifier
	}>()
	const IDPrefix = "new_"

	export let isLoadingInitialData: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let debitAccountID: string = UNKNOWN_OPTION
	export let creditAccountID: string = UNKNOWN_OPTION
	export let name: string = ""
	export let description: string =""
	export let kind: AcceptableModifierKind = acceptableModifierKinds[0]
	export let action: AcceptableModifierAction = acceptableModifierActions[0]

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/modifiers",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { modifier } = document

					debitAccountID = UNKNOWN_OPTION
					creditAccountID = UNKNOWN_OPTION
					name = ""
					description = ""
					kind = acceptableModifierKinds[0]
					action = acceptableModifierActions[0]
					errors.set([])
					dispatch("create", modifier)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createModifier() {
		await send({
			"body": JSON.stringify({
				"modifier": {
					"debit_account_id": parseInt(debitAccountID),
					"credit_account_id": parseInt(creditAccountID),
					name,
					description,
					kind,
					action
				}
			})
		})
	}

	$: mayShowForm = accounts.length >= 2
</script>

<DescriptiveForm individualName="Modifier" {mayShowForm} {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Modifiers are premade actions to create financial entries. Currently, manual input is the
			only kind of modifier available. Other kinds may added in the future to allow automated
			modifications on different accounts.
		</ElementalParagraph>
		<ElementalParagraph>
			Modifiers can also serve as references for financial entries. Everyone reading the entries
			would know if a financial entry was a result of manual input or automated calculations.
		</ElementalParagraph>
		<ElementalParagraph>
			To create a modifier to be used by the system, choose a debit account and a credit account
			that the modifier would be responsible. After that, fill out other required info. Finally,
			press "Add" button.
		</ElementalParagraph>
	</TextContainer>
	<TextContainer slot="requirement">
		<ElementalParagraph>
			At least two financial accounts must exist in the profile to show the form for creating
			modifiers.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		currencies={currencies}
		accounts={accounts}
		bind:debitAccountID={debitAccountID}
		bind:creditAccountID={creditAccountID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		bind:action={action}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createModifier}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
