<script lang="ts">
	import type { Writable } from "svelte/store"
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import { MAINTENANCE_EXPIRATION_MECHANISM, SUPPORTED_TOKEN_EXPIRATION_TYPES } from "#/rest"

	import makeJSONRequester from "$/rest/make_json_requester"

	import GridCell from "$/layout/grid_cell.svelte"
	import PasswordField from "$/form/password_field.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"
	import TextField from "$/form/text_field.svelte"

	const {
		serverURL,
		userEmail,
		accessToken,
		accessTokenMetadata
	} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
		serverURL: Writable<string>
		userEmail: Writable<string>
		accessToken: Writable<string>
		accessTokenMetadata: Writable<unknown>
	}

	let email = ""
	let password = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/login",
		"defaultRequestConfiguration": {
			"method": "POST",
			"credentials": "include"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					const { meta } = await response.json()
					const { data, expiration } = meta.token
					const accessTokenMetadataRaw = new Map([
						[ "type", expiration.type ],
						[ "data", expiration.data ],
						[ "startedAt", new Date() ],
						[ "lastUsedAt", new Date() ]
					])

					if (accessTokenMetadataRaw.get("type") === MAINTENANCE_EXPIRATION_MECHANISM) {
						accessToken.set(data)
						accessTokenMetadata.set(accessTokenMetadataRaw)
						userEmail.set(email)
						errors.set([])
					} else {
						errors.set([
							{
								"message": "The client can only support servers with \"maintenance\" expiration mechanism."
							}
						])
					}
				}
			},
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errors.set([]);
					userEmail.set(email)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401, 422 ]
	})

	async function logIn() {
		await send({
			"body": JSON.stringify({
				"@meta": {
					...SUPPORTED_TOKEN_EXPIRATION_TYPES
				},
				email,
				password
			})
		})
	}
</script>

<SingleForm isConnecting={$isConnecting} errors={$errors} on:submit={logIn}>
	<TextContainer slot="description_layer">
		<ShortParagraph>
			Enter the credentials you have on <ServerDisplay address={$serverURL}/> to log in.
		</ShortParagraph>
	</TextContainer>
	<svelte:fragment slot="field_layer">
		<GridCell kind="full">
			<TextField
				variant="email"
				fieldName="Email"
				disabled={$isConnecting}
				bind:value={email}
				errors={$errors}/>
		</GridCell>
		<GridCell kind="full">
			<PasswordField
				fieldName="Password"
				disabled={$isConnecting}
				bind:value={password}
				errors={$errors}/>
		</GridCell>
	</svelte:fragment>
	<svelte:fragment slot="action_layer">
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Access"/>
	</svelte:fragment>
</SingleForm>
