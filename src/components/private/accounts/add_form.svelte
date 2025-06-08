<script lang="ts">
import type { Currency, Account, AcceptableAccountKind } from "+/entity"

import { createEventDispatcher } from "svelte"

import { UNKNOWN_OPTION } from "#/component"
import { acceptableAccountKinds } from "#/entity"

import makeJSONRequester from "$/rest/make_json_requester"

import BasicForm from "%/accounts/basic_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": Account
}>()
const IDPrefix = "new_"

export let isLoadingInitialData: boolean
export let currencies: Currency[]

let currencyID: string = UNKNOWN_OPTION
let name: string = ""
let description: string =""
let kind: AcceptableAccountKind = acceptableAccountKinds[0]

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v2/accounts",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { account } = document

				currencyID = UNKNOWN_OPTION
				name = ""
				description = ""
				kind = acceptableAccountKinds[0]
				errors.set([])
				dispatch("create", account)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createAccount() {
	await send({
		"body": JSON.stringify({
			"account": {
				"currency_id": parseInt(currencyID),
				name,
				description,
				kind
			}
		})
	})
}

$: mayShowForm = currencies.length > 0
</script>

<DescriptiveForm individualName="Financial Account" {mayShowForm} {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Financial accounts are some kind of label for the numerical values in a financial entry.
			Some examples of these are capital, cash, or debt. They may be credited or debited
			depending on their kind. They may be asset, liability, or equity to name a few.
		</ElementalParagraph>
		<ElementalParagraph>
			To create a financial account to be used in the system, choose a currency and kind in order
			for the system to calculate properly the associated numerical values. After that, fill out
			other required info. Finally, press "Add" button.
		</ElementalParagraph>
	</TextContainer>
	<svelte:fragment slot="requirement">
		<ElementalParagraph>
			At least one currency must exist in the profile to show the form for creating financial
			accounts.
		</ElementalParagraph>
	</svelte:fragment>
	<BasicForm
		slot="form"
		{currencies}
		bind:currencyID={currencyID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createAccount}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
