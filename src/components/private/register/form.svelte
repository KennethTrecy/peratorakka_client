<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { get } from "svelte/store"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

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
	let isConnecting = false
	let errors: GeneralError[] = []

	async function register() {
		const currentServerURL = get(serverURL)
		isConnecting = true

		try {
			const response = await fetch(`${currentServerURL}/register`, {
				"method": "POST",
				"mode": "cors",
				"credentials": "include",
				"referrer": currentServerURL,
				"body": JSON.stringify({
					username,
					email,
					password,
					"password_confirm": passwordConfirmation
				}),
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			const statusCode = response.status
			if (statusCode === 201) {
				errors = []
				userEmail.set(email)
			} else if (statusCode === 401) {
				errors = (await response.json()).errors
			} else {
				throw new Error(
					`Unexpected status code was returned by the server: ${response.status}.`
				)
			}
		} catch (receivedErrors) {
			if (Array.isArray(receivedErrors)) {
				errors = receivedErrors
			} else {
				errors = [
					{
						"message": (receivedErrors as Error).message
					}
				]
			}
		}

		isConnecting = false
	}
</script>

<SingleForm on:submit={register}>
	<p class="center-align" slot="description_layer">
		Enter the credentials to be sent to <code>{$serverURL}</code> to register.
	</p>
	<fieldset slot="field_layer">
		<TextField
			fieldName="Username"
			disabled={isConnecting}
			bind:value={username}
			{errors}/>
		<TextField
			variant="email"
			fieldName="Email"
			disabled={isConnecting}
			bind:value={email}
			{errors}/>
		<PasswordField
			fieldName="Password"
			disabled={isConnecting}
			bind:value={password}
			{errors}/>
		<PasswordField
			fieldName="Confirm Password"
			disabled={isConnecting}
			bind:value={passwordConfirmation}
			{errors}/>
	</fieldset>
	<button type="submit" disabled={isConnecting} slot="action_layer">
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
