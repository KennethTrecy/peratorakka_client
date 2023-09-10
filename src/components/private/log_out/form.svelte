<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		userEmail,
		mustHaveToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	applyRequirements([
		mustHaveToken,
		mustBeAuthenticatedUser
	], {
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
					errors.set([])
					userEmail.set("")
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function logOut() {
		await send({})
	}
</script>

<SingleForm on:submit={logOut}>
	<TextContainer slot="description_layer">
		<ShortParagraph>
			Please confirm if the client would request on
			<ServerDisplay address={$serverURL}/> to log out.
		</ShortParagraph>
	</TextContainer>
	<svelte:fragment slot="action_layer">
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Confirm"/>
	</svelte:fragment>
</SingleForm>
