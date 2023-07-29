<script lang="ts">
	import { onDestroy } from "svelte"
	import { get } from "svelte/store"
	import { goto } from "$app/navigation"

	import { serverURL, hasRequirements, mustHaveToken, redirectPath } from "$/global_state"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let name = ""
	let email = ""
	let password = ""
	let passwordConfirmation = ""
	let isConnecting = false
	let errors = []

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
					name,
					email,
					password,
					passwordConfirmation
				}),
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			if (response.status === 201) {
				errors = []
				const responseDocument = await response.json()
				console.log(responseDocument)
			} else {
				console.log("status", response.status)
				throw new Error()
			}
		} catch (error) {
			errors = []
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
					<div class="field label border">
						<input type="text" bind:value={name} id="name" disabled={isConnecting}>
						<label for="name">Name</label>
					</div>
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
					<div class="field label border">
						<input
							type="password"
							id="password_confirmation"
							disabled={isConnecting}
							bind:value={passwordConfirmation}/>
						<label for="password_confirmation"><span>Confirm Password</span></label>
					</div>
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
