<script lang="ts">
	import { onDestroy } from "svelte"
	import { goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import {
		serverURL,
		userEmail,
		hasRequirements,
		mustHaveToken,
		mustBeAuthenticatedUser,
		redirectPath
	} from "$/global_state"

	import PasswordField from "$/form/password_field.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextField from "$/form/text_field.svelte"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	mustBeAuthenticatedUser.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/logout",
		"defaultRequestConfiguration": {
			"method": "POST"
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
	<p class="center-align" slot="description_layer">
		Please confirm the client would request on <code>{$serverURL}</code> to log out.
	</p>
	<fieldset slot="field_layer">

	</fieldset>
	<button type="submit" disabled={$isConnecting} slot="action_layer">
		Confirm
	</button>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/index";

	fieldset {
		@extend nav;
		flex-direction: column;
	}
</style>
