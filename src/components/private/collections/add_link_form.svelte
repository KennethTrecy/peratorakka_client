<script lang="ts">
import type { Account, AccountCollection, Collection, Currency } from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_OPTION } from "#/component"
import makeJSONRequester from "$/rest/make_json_requester"

import BasicLinkForm from "%/collections/basic_link_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	collection,
	currencies,
	accounts,
	linkedAccounts,
	create
}: {
	collection: Collection
	currencies: Currency[]
	accounts: Account[]
	linkedAccounts: Account[]
	create: (data: AccountCollection) => void
} = $props()

const IDPrefix = "link_"
let collectionID = $state(`${collection.id}`)
let accountID = $state(UNKNOWN_OPTION)

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v2/account_collections",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { account_collection } = document

				accountID = UNKNOWN_OPTION
				errors.set([])
				create(account_collection)
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

$effect(() => {
	if (untrack(() => collectionID) !== `${collection.id}`) {
		untrack(() => {
			collectionID = `${collection.id}`
			accountID = UNKNOWN_OPTION
		})
	}
});
</script>

<DescriptiveForm individualName="Add Linked Accounts" mayShowForm>
	{#snippet description()}
		<TextContainer >
			<ElementalParagraph>
				Collections are used to group multiple financial accounts. They help in calculating a
				formula or presenting data.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form()}
		<BasicLinkForm
			bind:accountID={accountID}
			{collection}
			{currencies}
			{accounts}
			{linkedAccounts}
			isConnecting={$isConnecting}
			{IDPrefix}
			errors={$errors}
			onsubmit={createAccountCollection}>
			{#snippet button_group()}
				<TextCardButton
					kind="submit"
					disabled={$isConnecting}
					label="Add"/>
			{/snippet}
		</BasicLinkForm>
	{/snippet}
</DescriptiveForm>
