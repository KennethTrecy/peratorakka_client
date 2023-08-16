<script lang="ts">
	import { onMount, onDestroy } from "svelte"

	import { initializeGlobalStates, unsubscribeWatchedGlobalStates } from "$/global_state"
	import { setTheme } from "@/components/third-party/index"
	import { initializeShellState, unsubscribeWatchedStates } from "%/shell/state"

	import TopAppBar from "%/shell/top_app_bar.svelte"

	onMount(() => {
		setTheme("/logo.png")
		initializeShellState()
		initializeGlobalStates()
	})

	onDestroy(unsubscribeWatchedGlobalStates)
	onDestroy(unsubscribeWatchedStates)

	/**
	 * Previous main
	 * <InnerShell {isMenuShown} on:toggleMenu={toggleMenu}>
	 * </InnerShell>
	 */
</script>

<svelte:head>
	<style>
		* {
			box-sizing: border-box;
			padding: 0em;
			border: 0em;
			margin: 0em;
		}
	</style>
</svelte:head>

<div class="shell">
	<TopAppBar/>
	<main class="mdc-top-app-bar--fixed-adjust">
		<slot name="main"></slot>
	</main>
</div>

<style lang="scss">
	@use "@/components/third-party/new_index";

	.shell {
		width: 100%;
		min-height: 100%;

		display: flex;
		flex-flow: column nowrap;

		> main {
			flex: 1;
		}
	}

	footer {
		padding: 1rem;
	}
</style>
