<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		userEmail,
		mustHaveToken,
		mustBeGuest
	} from "$/global_state"

	import PasswordField from "$/form/password_field.svelte"
	import SingleForm from "$/form/single_form.svelte"
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
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
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
	<p class="center-align" slot="description_layer">
		Enter the credentials you have on <code>{$serverURL}</code> to log in.
	</p>
	<fieldset slot="field_layer">
		<TextField
			variant="email"
			fieldName="Email"
			disabled={$isConnecting}
			bind:value={email}
			errors={$errors}/>
		<PasswordField
			fieldName="Password"
			disabled={$isConnecting}
			bind:value={password}
			errors={$errors}/>
	</fieldset>
	<button type="submit" disabled={$isConnecting} slot="action_layer">
		Access
	</button>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/index";

	fieldset {
		@extend nav;
		flex-direction: column;
	}
</style>
