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

	let username = ""
	let email = ""
	let password = ""
	let passwordConfirmation = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/register",
		"defaultRequestConfiguration": {
			"method": "POST",
			"credentials": "include"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
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
			}
		],
		"expectedErrorStatusCodes": [ 401, 422 ]
	})

	async function register() {
		await send({
			"body": JSON.stringify({
				"@meta": {
					...SUPPORTED_TOKEN_EXPIRATION_TYPES
				},
				username,
				email,
				password,
				"password_confirm": passwordConfirmation
			})
		})
	}
</script>

<SingleForm isConnecting={$isConnecting} errors={$errors} on:submit={register}>
	<TextContainer slot="description_layer">
		<ShortParagraph>
			Enter the credentials to be sent to <ServerDisplay address={$serverURL}/> to register.
		</ShortParagraph>
	</TextContainer>
	<svelte:fragment slot="field_layer">
		<GridCell kind="full">
			<TextField
				fieldName="Username"
				disabled={$isConnecting}
				bind:value={username}
				errors={$errors}/>
		</GridCell>
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
		<GridCell kind="full">
			<PasswordField
				fieldName="Confirm Password"
				disabled={$isConnecting}
				bind:value={passwordConfirmation}
				errors={$errors}/>
		</GridCell>
	</svelte:fragment>
	<svelte:fragment slot="action_layer">
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Register"/>
	</svelte:fragment>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/typography/mdc-typography";

	.mdc-typography {
		margin-top: 1rem;
	}
</style>
