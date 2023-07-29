<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { get } from "svelte/store"

	import { serverURL, hasServer, hasToken } from "$/global_state"

	let email = ""
	let password = ""
	let isConnecting = false

	async function logIn() {

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
