<script lang="ts">
	import { onDestroy } from "svelte"
	import { get } from "svelte/store"
	import { goto } from "$app/navigation"

	import {
		serverURL,
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
	let errors = []

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

			switch (response.status) {
				case 200: {
					errors = []
					const responseDocument = await response.json()
					break;
				}

				case 401: {
					errors = (await response.json()).errors
					break;
				}

				default:
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
					<div class="field label border">
						<input type="text" bind:value={email} id="email" disabled={isConnecting}>
						<label for="email">Email</label>
					</div>
					<div class="field label border">
						<input
							type="password"
							id="password"
							disabled={isConnecting}
							bind:value={password}/>
						<label for="password">Password</label>
					</div>
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
