<script lang="ts">
import type { Account, AccountCollection, Collection, Currency } from "+/entity"

import { createEventDispatcher } from "svelte"

import { UNKNOWN_OPTION } from "#/component"
import makeJSONRequester from "$/rest/make_json_requester"

import BasicLinkForm from "%/collections/basic_link_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": AccountCollection
}>()

export let isLoadingInitialData: boolean
export let collection: Collection
export let currencies: Currency[]
export let accounts: Account[]
export let linkedAccounts: Account[]

const IDPrefix = "link_"
let collectionID = `${collection.id}`
let accountID = UNKNOWN_OPTION

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/account_collections",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { account_collection } = document

				accountID = ""
				errors.set([])
				dispatch("create", account_collection)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createAccountCollection() {
	await send({
		"body": JSON.stringify({
			"account_collection": {
				"collection_id": +collectionID,
				"account_id": +accountID
			}
		})
	})
}
</script>

<DescriptiveForm individualName="Accounts" mayShowForm {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Collections are used to group multiple financial accounts. They help in calculating a formula or presenting data.
		</ElementalParagraph>
	</TextContainer>
	<BasicLinkForm
		slot="form"
		bind:accountID={accountID}
		{collection}
		{currencies}
		{accounts}
		{linkedAccounts}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createAccountCollection}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicLinkForm>
</DescriptiveForm>
