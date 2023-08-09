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

	import SingleForm from "$/form/single_form.svelte"

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
			"method": "GET"
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
