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

<form class="list middle-align center-align grid" on:submit={logIn}>
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill middle-align center-align">
			<div class="center-align large-padding">
				<img class="small extra" src="logo.png" alt="Peratorakka logo"/>
				<div class="space"></div>
				<p class="center-align">
					Enter the credentials you have on <code>{$serverURL}</code> to log in.
				</p>
				<fieldset class="center-align">
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
				<div class="space"></div>
				<button type="submit" disabled={isConnecting}>
					Access
				</button>
			</div>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";

	.list {
		width: 100%;
		height: 80%;
	}

	fieldset {
		@extend nav;
		flex-direction: column;
	}
</style>
