<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { get } from "svelte/store"

	import { hasServer, hasToken } from "$/global_state"

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
				<h1 class="center-align">Log in</h1>
				<div class="space"></div>
				<div class="no-space center-align">
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
				</div>
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

	h1 {
		@extend h5;
	}
</style>
