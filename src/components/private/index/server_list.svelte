<script lang="ts">
	import { PUBLIC_PRODUCTION_SERVER_CHOICES } from "$env/static/public"

	import { serverURL, hasServer, hasToken, serverIcon } from "$/global_state"

	const CUSTOM_KEY = "custom"

	const rawServerChoices: string[] = PUBLIC_PRODUCTION_SERVER_CHOICES.split(",")
	const domainNameRegex = /https?:\/\/(.+)/
	const serverChoices = rawServerChoices.map(rawServer => ({
		"URL": rawServer,
		"name": (domainNameRegex.exec(rawServer) ?? [ null, rawServer ])[1]
	}))
	let selectedServer = ""
	let customServer = ""
	$: resolvedSelectedServer = selectedServer === CUSTOM_KEY
		? customServer
		: selectedServer

	function connect(event: SubmitEvent) {
		event.preventDefault()
		serverURL.set(resolvedSelectedServer)
	}
</script>

<div class="list middle-align center-align grid">
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill medium-height middle-align center-align">
			<div class="center-align medium-padding">
				<i class="extra">{$serverIcon}</i>
				{#if $hasToken}
					<h1>You currently connected to <code>{$serverURL}</code></h1>
					<p>You may change your current server</p>
					<p><strong>Note</strong>: Doing so may log out any current account</p>
				{:else if $hasServer}
					<h1>The client is trying to connect to the server</h1>
					<p>Please wait for a moment...</p>
				{:else}
					<h1>You are not yet connected to any server</h1>
					<p>Choose or specify a server you want to connect</p>
				{/if}
				<div class="space"></div>
				<form class="no-space center-align" on:submit={connect}>
					<div class="field label suffix small">
						<select id="server_choices" class="active" bind:value={selectedServer}>
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
					<button type="submit">Connect</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	div.list {
		width: 100%;
		height: 100%;
	}

	h1 {
		@extend h5;
	}

	form {
		@extend nav;
	}
</style>
