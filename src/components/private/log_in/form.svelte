<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { MAINTENANCE_EXPIRATION_MECHANISM } from "#/rest"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		userEmail,
		accessToken,
		accessTokenMetadata,

		mustHaveToken,
		mustBeGuest
	} from "$/global_state"

	import GridCell from "$/layout/grid_cell.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import PasswordField from "$/form/password_field.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"
	import TextField from "$/form/text_field.svelte"

	applyRequirements([
		mustHaveToken,
		mustBeGuest
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

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
						userEmail.set("email")
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
					errors.set([])
					userEmail.set(email)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function logIn() {
		await send({
			"body": JSON.stringify({
				email,
				password
			})
		})
	}
</script>

<SingleForm on:submit={logIn}>
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
