<script lang="ts">
	import { PUBLIC_PRODUCTION_SERVER_CHOICES } from "$env/static/public"

	import { serverURL, CSRFToken, hasServer, hasToken, serverIcon } from "$/global_state"

	const CUSTOM_KEY = "custom"

	const rawServerChoices: string[] = PUBLIC_PRODUCTION_SERVER_CHOICES.split(",")
	const domainNameRegex = /https?:\/\/(.+)/
	const serverChoices = rawServerChoices.map(rawServer => ({
		"URL": rawServer,
		"name": (domainNameRegex.exec(rawServer) ?? [ null, rawServer ])[1]
	}))
	let selectedServer = serverChoices[0].URL ?? CUSTOM_KEY
	let customServer = ""
	$: mustBeCustomServer = selectedServer === CUSTOM_KEY
	$: resolvedSelectedServer = mustBeCustomServer
		? customServer
		: selectedServer

	let isConnecting = false
	let didConnectionFail = false
	async function connect(event: SubmitEvent) {
		event.preventDefault()
		isConnecting = true
		didConnectionFail = false
		serverURL.set(resolvedSelectedServer)

		try {
			const response = await fetch(`${resolvedSelectedServer}/`, {
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			})

			if (response.status === 200) {
				didConnectionFail = false
				const responseDocument = await response.json()
				CSRFToken.set(responseDocument.data.csrf_token)
			} else {
				throw new Error()
			}
		} catch (error) {
			didConnectionFail = true
			serverURL.set("")
		}

		isConnecting = false
	}
</script>

<form class="list middle-align center-align grid" on:submit={connect}>
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill middle-align center-align">
			<div class="center-align large-padding">
				<i class="extra">{$serverIcon}</i>
				{#if $hasToken}
					<h1>You currently connected to <code>{$serverURL}</code></h1>
					<p>You may change your current server</p>
					<p><strong>Note</strong>: Doing so may log out any current account</p>
				{:else if $hasServer}
					<h1>The client is trying to connect to the server</h1>
					<p>Please wait for a moment</p>
				{:else if didConnectionFail}
					<h1>The client cannot connect to the server</h1>
					<p>Please look for another compatible server</p>
				{:else}
					<h1>You are not yet connected to any server</h1>
					<p>Choose or specify a server you want to connect</p>
				{/if}
				<div class="space"></div>
				<fieldset class="no-space center-align">
					<div class="field label suffix small">
						<select
							id="server_choices"
							class="active"
							disabled={isConnecting}
							bind:value={selectedServer}>
							{#each serverChoices as { URL, name }(URL)}
								<option value={URL}>
									{name}
								</option>
							{/each}
							<option value={CUSTOM_KEY}>Custom</option>
						</select>
						<label for="server_choices" class="active">Servers</label>
						<i>arrow_drop_down</i>
					</div>
				</fieldset>
				{#if mustBeCustomServer}
					<div class="space"></div>
					<div class="no-space center-align">
						<div class="field border">
							<input type="text" bind:value={customServer} disabled={isConnecting}>
							<span class="helper">Example: http://peratorakka.example.com</span>
						</div>
					</div>
				{/if}
				<div class="space"></div>
				<button type="submit" disabled={isConnecting}>Connect</button>
			</div>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";

	.list {
		width: 100%;
		height: 100%;
	}

	h1 {
		@extend h5;
	}

	fieldset {
		@extend nav;
	}

	.fill {
		height: max-content;
		transition: height 250ms ease-in;
	}
</style>
