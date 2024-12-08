<script lang="ts">
import type { Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { getContext } from "svelte"

import { GLOBAL_CONTEXT } from "#/contexts"

import makeJSONRequester from "$/rest/make_json_requester"

import ServerDisplay from "$/utility/server_display.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import CardForm from "$/form/card_form.svelte"
import TextField from "$/form/text_field.svelte"

const {
	serverURL,
	userEmail
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	serverURL: Writable<string>
	userEmail: Writable<string>
}

let email = ""
let username = ""
let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/user",
	"defaultRequestConfiguration": {
		"method": "PATCH",
		"credentials": "include"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 204,
			"action": async (_response: Response) => {
				errors.set([])
				userEmail.set(email)
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
</script>

<CardForm
	id={null}
	isConnecting={$isConnecting}
	errors={$errors}
	actionLabel="Change plain credentials"
	on:submit={update}>
	<ShortParagraph slot="text_description">
		Update the credentials you have on <ServerDisplay address={$serverURL}/>.
	</ShortParagraph>
	<svelte:fragment slot="fields">
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
	</svelte:fragment>
</CardForm>
