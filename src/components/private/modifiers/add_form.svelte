<script lang="ts">
	import type { Account, Modifier, AcceptableModifierKind } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { UNKNOWN_OPTION } from "#/component"
	import { acceptableModifierKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/modifiers/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import MarginlessButton from "$/utility/marginless_button.svelte"
	import JustifiedParagraph from "$/utility/justified_paragraph.svelte"

	const dispatch = createEventDispatcher<{
		"create": Modifier
	}>()
	const IDPrefix = "new_"

	export let accounts: Account[]
	export let debitAccountID: string = UNKNOWN_OPTION
	export let creditAccountID: string = UNKNOWN_OPTION
	export let name: string = ""
	export let description: string =""
	export let kind: AcceptableModifierKind = acceptableModifierKinds[0]

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
					kind
				}
			})
		})
	}

	$: mayShowForm = accounts.length >= 2
</script>

<DescriptiveForm individualName="Financial Account" {mayShowForm}>
	<svelte:fragment slot="description">
		<JustifiedParagraph>
			Modifiers are premade actions to create financial entries. Currently, manual input is the
			only kind of modifier available. Other kinds may added in the future to allow automated
			modifications on different accounts.
		</JustifiedParagraph>
		<JustifiedParagraph>
			Modifiers can also serve as references for financial entries. Everyone reading the entries
			would know if a financial entry was a result of manual input or automated calculations.
		</JustifiedParagraph>
		<JustifiedParagraph>
			To create a modifier to be used by the system, choose a debit account and a credit account
			that the modifier would be responsible. After that, fill out other required info. Finally,
			press "Add" button.
		</JustifiedParagraph>
	</svelte:fragment>
	<svelte:fragment slot="requirement">
		<JustifiedParagraph>
			At least two financial accounts must exist in the profile to show the form for creating
			modifiers.
		</JustifiedParagraph>
	</svelte:fragment>
	<BasicForm
		slot="form"
		bind:accounts={accounts}
		bind:debitAccountID={debitAccountID}
		bind:creditAccountID={creditAccountID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createModifier}>
		<svelte:fragment slot="buttonGroup">
			<MarginlessButton kind="submit" disabled={$isConnecting}>
				Add
			</MarginlessButton>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
