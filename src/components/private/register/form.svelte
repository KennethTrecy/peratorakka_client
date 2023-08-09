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

	let username = ""
	let email = ""
	let password = ""
	let passwordConfirmation = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/register",
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

	async function register() {
		await send({
			"body": JSON.stringify({
				username,
				email,
				password,
				"password_confirm": passwordConfirmation
			})
		})
	}
</script>

<SingleForm on:submit={register}>
	<p class="center-align" slot="description_layer">
		Enter the credentials to be sent to <code>{$serverURL}</code> to register.
	</p>
	<fieldset slot="field_layer">
		<TextField
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
		<PasswordField
			fieldName="Password"
			disabled={$isConnecting}
			bind:value={password}
			errors={$errors}/>
		<PasswordField
			fieldName="Confirm Password"
			disabled={$isConnecting}
			bind:value={passwordConfirmation}
			errors={$errors}/>
	</fieldset>
	<button type="submit" disabled={$isConnecting} slot="action_layer">
		Register
	</button>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/index";

	fieldset {
		@extend nav;
		flex-direction: column;
	}
</style>
