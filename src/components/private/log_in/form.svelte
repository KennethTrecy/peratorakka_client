<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { onDestroy } from "svelte"
	import { get } from "svelte/store"
	import { goto } from "$app/navigation"

	import {
		serverURL,
		userEmail,
		hasRequirements,
		mustHaveToken,
		mustBeGuest,
		redirectPath
	} from "$/global_state"

	import PasswordField from "$/form/password_field.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextField from "$/form/text_field.svelte"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	mustBeGuest.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let email = ""
	let password = ""
	let isConnecting = false
	let errors: GeneralError[] = []

	async function logIn() {
		const currentServerURL = get(serverURL)
		isConnecting = true

		try {
			const response = await fetch(`${currentServerURL}/login`, {
				"method": "POST",
				"mode": "cors",
				"credentials": "include",
				"referrer": currentServerURL,
				"body": JSON.stringify({
					email,
					password
				}),
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			const statusCode = response.status
			if (statusCode === 200) {
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

<SingleForm on:submit={logIn}>
	<p class="center-align" slot="description_layer">
		Enter the credentials you have on <code>{$serverURL}</code> to log in.
	</p>
	<fieldset slot="field_layer">
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
	</fieldset>
	<button type="submit" disabled={isConnecting} slot="action_layer">
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
