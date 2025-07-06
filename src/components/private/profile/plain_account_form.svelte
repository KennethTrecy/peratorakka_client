<script lang="ts">
import type { Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { getContext, onMount } from "svelte"

import { GLOBAL_CONTEXT } from "#/contexts"

import makeJSONRequester from "$/rest/make_json_requester"

import ServerDisplay from "$/utility/server_display.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import CardForm from "$/form/card_form.svelte"
import TextField from "$/form/text_field.svelte"

const {
	serverURL,
	userName,
	userEmail
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	serverURL: Writable<string>
	userName: Writable<string>
	userEmail: Writable<string>
}

let email = $state("")
let username = $state("")
let lastUpdate: Date|null = $state(null)
let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v2/user",
	"defaultRequestConfiguration": {
		"method": "PATCH",
		"credentials": "include"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 204,
			"action": async (_response: Response) => {
				errors.set([])

				if (username !== "") {
					userName.set(username)
				}
				if (email !== "") {
					userEmail.set(email)
				}

				lastUpdate = new Date()
			}
		}
	],
	"expectedErrorStatusCodes": [ 400, 422 ]
})

async function update() {
	await send({
		"body": JSON.stringify({
			"user": {
				username,
				email
			}
		})
	})
}

$effect(() => {
	email = $userEmail
	username = $userName
})
</script>

<CardForm
	id={null}
	isConnecting={$isConnecting}
	errors={$errors}
	actionLabel="Change plain credentials"
	onsubmit={update}>
	{#snippet text_description()}
		<ShortParagraph>
			Update the credentials you have on <ServerDisplay address={$serverURL}/>.
		</ShortParagraph>
		{#if lastUpdate}
			<ShortParagraph>
				Your credentials have been updated sucessfully last {lastUpdate.toLocaleString()}.
			</ShortParagraph>
		{/if}
	{/snippet}
	{#snippet fields()}
		<TextField
			variant="text"
			fieldName="Username"
			disabled={$isConnecting}
			bind:value={username}
			errors={$errors}/>
		<TextField
			variant="email"
			fieldName="Email"
			disabled={$isConnecting}
			bind:value={email}
			errors={$errors}/>
	{/snippet}
</CardForm>
