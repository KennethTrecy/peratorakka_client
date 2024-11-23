<script lang="ts">
import type { Writable, Readable } from "svelte/store"
import type { GeneralError } from "+/rest"
import type { ChoiceInfo, ContextBundle } from "+/component"

import { getContext } from "svelte"

import { GLOBAL_CONTEXT } from "#/contexts"
import { PUBLIC_PRODUCTION_SERVER_CHOICES } from "$env/static/public"

import makeJSONRequester from "$/rest/make_json_requester"

import ChoiceListField from "$/form/choice_list_field.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import ServerDisplay from "$/utility/server_display.svelte"
import SingleForm from "$/form/single_form.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"
import TextField from "$/form/text_field.svelte"
import WeakenedPrimaryHeading from "$/typography/weakened_primary_heading.svelte"

const {
	serverURL,
	CSRFToken,
	hasServer,
	hasToken,
	hasCompatibleServer
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	serverURL: Writable<string>
	CSRFToken: Writable<string>
	hasServer: Readable<boolean>
	hasToken: Readable<boolean>
	hasCompatibleServer: Readable<boolean>
}

const CUSTOM_KEY = "custom"

const rawServerChoices: string[] = PUBLIC_PRODUCTION_SERVER_CHOICES.split(",")
let selectedServer = rawServerChoices[0] ?? CUSTOM_KEY
let customServer = ""
$: mustBeCustomServer = selectedServer === CUSTOM_KEY
$: resolvedSelectedServer = mustBeCustomServer
	? customServer
	: selectedServer
$: serverChoices = [
	...rawServerChoices,
	CUSTOM_KEY
]
const domainNameRegex = /https?:\/\/(.+)/
function transformServer(server: string): ChoiceInfo {
	let label = "Custom"
	let data = CUSTOM_KEY
	if (server !== CUSTOM_KEY) {
		label = (domainNameRegex.exec(server) ?? [ null, server ])[1]
		data = server
	}

	return { label, data }
}
const CUSTOM_SERVER_FIELD_NAME = "Custom Server URL"
const errors: GeneralError[] = [
	{
		"field": "custom_server_url",
		"message": "Example: http://peratorakka.example.com"
	}
]

let isConnecting = false
let didConnectionFail = false

const { send } = makeJSONRequester({
	"path": "/",
	"defaultRequestConfiguration": {},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async function(response) {
				didConnectionFail = false
				const responseDocument = await response.json()
				CSRFToken.set(responseDocument.data.csrf_token)
			},
		}
	],
	expectedErrorStatusCodes: [ 403 ],
})

async function connect(event: SubmitEvent) {
	event.preventDefault()
	isConnecting = true
	didConnectionFail = false
	serverURL.set(resolvedSelectedServer)

	try {
		await send({})
	} catch (error) {
		didConnectionFail = true
		serverURL.set("")
		errors[0] = {
			"field": "custom_server_url",
			"message": "client fails to connect to the server"
		}
	}

	isConnecting = false
}
</script>

<SingleForm	{isConnecting} errors={[]} on:submit={connect}>
	<TextContainer slot="description_layer">
		{#if $hasToken}
			<WeakenedPrimaryHeading>
				Status: Connected
			</WeakenedPrimaryHeading>
			<ShortParagraph>
				You may change your current server (<ServerDisplay address={$serverURL}/>).
			</ShortParagraph>
			<ShortParagraph>
				<strong>Note</strong>: Doing so may log out any current account.
			</ShortParagraph>
		{:else if $hasServer}
			<WeakenedPrimaryHeading>
				Status: Connecting
			</WeakenedPrimaryHeading>
			<ShortParagraph>
				Please wait for a moment.
			</ShortParagraph>
		{:else if didConnectionFail || $hasCompatibleServer}
			<WeakenedPrimaryHeading>
				Status: Connection Failed
			</WeakenedPrimaryHeading>
			<ShortParagraph>
				Please look for another compatible server.
			</ShortParagraph>
		{:else}
			<WeakenedPrimaryHeading>
				Status: Not Connected
			</WeakenedPrimaryHeading>
			<ShortParagraph>
				Choose or specify a server you want to connect.
			</ShortParagraph>
		{/if}
	</TextContainer>
	<svelte:fragment slot="field_layer">
		<GridCell kind="full">
			<ChoiceListField
				fieldName="Servers"
				disabled={isConnecting}
				bind:value={selectedServer}
				rawChoices={serverChoices}
				choiceConverter={transformServer}
				IDPrefix="list_"
				errors={errors}/>
		</GridCell>
		{#if mustBeCustomServer}
			<GridCell kind="full">
				<TextField
					fieldName={CUSTOM_SERVER_FIELD_NAME}
					disabled={isConnecting}
					bind:value={customServer}
					errors={errors}/>
			</GridCell>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="action_layer">
		<TextCardButton
			kind="submit"
			disabled={isConnecting}
			label={$hasToken ? "Reconnect" : "Connect"}/>
	</svelte:fragment>
</SingleForm>

<style lang="scss">
@use "@/components/third-party/index";
</style>
