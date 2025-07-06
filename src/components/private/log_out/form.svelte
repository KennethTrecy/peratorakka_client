<script lang="ts">
import type { Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { get } from "svelte/store"
import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import ServerDisplay from "$/utility/server_display.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import SingleForm from "$/form/single_form.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

const {
	serverURL,
	userName,
	userEmail,
	accessTokenMetadata,
	CSRFToken
} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
	serverURL: Writable<string>,
	userName: Writable<string>,
	userEmail: Writable<string>,
	accessTokenMetadata: Writable<Map<string, string>>,
	CSRFToken: Writable<string>
}

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/logout",
	"defaultRequestConfiguration": {
		"method": "GET",
		"credentials": "include"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				userName.set("")
				userEmail.set("")
				accessTokenMetadata.set(new Map())

				try {
					const response = await fetch(`${get(serverURL)}/`, {
						"method": "GET",
						"mode": "cors",
						"credentials": "include"
					})

					if (response.status === 200) {
						const responseDocument = await response.json()
						CSRFToken.set(responseDocument.data.csrf_token)
					} else {
						throw new Error()
					}

					errors.set([])
				} catch (error) {
					serverURL.set("")
					errors.set([
						{
							"message": "Client fails to request new CSRF token to server"
						}
					])
				}
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

async function logOut() {
	await send({})
}
</script>

<SingleForm isConnecting={$isConnecting} errors={$errors} onsubmit={logOut}>
	{#snippet description_layer()}
		<TextContainer >
			<ShortParagraph>
				Please confirm if the client would request on
				<ServerDisplay address={$serverURL}/> to log out.
			</ShortParagraph>
		</TextContainer>
	{/snippet}
	{#snippet action_layer()}
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Confirm"/>
	{/snippet}
</SingleForm>
