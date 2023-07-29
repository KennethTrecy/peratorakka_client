<script lang="ts">
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
	import TextField from "$/form/text_field.svelte"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	mustBeGuest.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let username = ""
	let email = ""
	let password = ""
	let passwordConfirmation = ""
	let isConnecting = false
	let errors: { "field"?: string, "message": string }[] = []

	$: usernameErrors = errors.filter(error => error.field === "username")

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

<form class="single_form middle-align center-align grid" on:submit={register}>
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill middle-align center-align">
			<div class="center-align large-padding">
				<img class="small extra" src="logo.png" alt="Peratorakka logo"/>
				<div class="space"></div>
				<p class="center-align">
					Enter the credentials to be sent to <code>{$serverURL}</code> to register.
				</p>
				<div class="space"></div>
				<fieldset class="center-align">
					<TextField
						fieldName="Username"
						disabled={isConnecting}
						bind:value={username}/>
					<TextField
						fieldName="Email"
						disabled={isConnecting}
						bind:value={email}/>
					<PasswordField
						fieldName="Password"
						disabled={isConnecting}
						bind:value={password}/>
					<PasswordField
						fieldName="Confirm Password"
						disabled={isConnecting}
						bind:value={passwordConfirmation}/>
				</fieldset>
				<div class="space"></div>
				<button type="submit" disabled={isConnecting}>
					Register
				</button>
			</div>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";

	.single_form {
		width: 100%;
		height: 80%;
	}

	fieldset {
		margin: 0% 10%;
		width: 80%;
	}
</style>
